const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const mongoose = require("mongoose");

// These tests must not open a database connection or boot the HTTP server.
mongoose.set("bufferCommands", false);

const { Server } = require("socket.io");
const { createAdminRoomController, authorizeAdminRoom } = require("./adminRoom");
const User = require("../Models/Users");
const { updateUserRole } = require("../Controllers/AdminController");

function waitFor(predicate) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const check = () => {
      if (predicate()) return resolve();
      if (tries >= 50) return reject(new Error("timed out waiting for socket role lookup"));
      tries += 1;
      setImmediate(check);
    };
    check();
  });
}

async function withServer(run) {
  const httpServer = http.createServer();
  const io = new Server(httpServer);
  try {
    await run(io);
  } finally {
    io.close();
  }
}

function attachSocket(io, id, userId, { admin = false } = {}) {
  const nsp = io.of("/");
  const socket = {
    id,
    // A local Socket.IO socket has `server` set. Without it, fetchSockets
    // treats the instance as remote and drops the user object.
    server: io,
    user: { _id: String(userId) },
    disconnected: false,
    get rooms() {
      return nsp.adapter.sids.get(id) || new Set();
    },
    join(room) {
      const names = new Set(Array.isArray(room) ? room : [room]);
      nsp.adapter.addAll(id, names);
    },
    leave(room) {
      nsp.adapter.del(id, room);
    },
    disconnect() {
      this.disconnected = true;
      nsp.adapter.delAll(id);
      nsp.sockets.delete(id);
    },
  };
  nsp.sockets.set(id, socket);
  socket.join(id);
  socket.join(`user_${userId}`);
  if (admin) socket.join("admins");
  return socket;
}

async function adminIds(io) {
  const sockets = await io.in("admins").fetchSockets();
  return sockets.map((socket) => socket.id).sort();
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function callUpdate(doc, role, io) {
  const originalLookup = User.findById;
  const originalIo = global.io;
  User.findById = () => ({ select: () => Promise.resolve(doc) });
  global.io = io;
  const res = mockRes();
  try {
    await updateUserRole(
      {
        params: { id: String(doc._id) },
        body: { role },
        user: { _id: new mongoose.Types.ObjectId().toString() },
      },
      res
    );
    return res;
  } finally {
    User.findById = originalLookup;
    global.io = originalIo;
  }
}

test("stale admin lookup after demotion does not join the admins room", async () => {
  await withServer(async (io) => {
    const guard = createAdminRoomController();
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId);
    socket.user.role = "admin";
    const other = attachSocket(io, `other-${userId}`, new mongoose.Types.ObjectId().toString(), { admin: true });

    let releaseLookup;
    let reads = 0;
    const pending = guard.authorizeAdminRoom(socket, async () => {
      reads += 1;
      if (reads === 1) {
        await new Promise((resolve) => {
          releaseLookup = resolve;
        });
      }
      return "admin";
    });

    await waitFor(() => reads === 1 && typeof releaseLookup === "function");
    const sync = await guard.syncSocketAccess(io, userId, "user");
    releaseLookup();
    const result = await pending;

    assert.equal(sync.ok, true);
    assert.equal(result.joined, false);
    assert.equal(socket.disconnected, false);
    assert.equal(socket.rooms.has("admins"), false);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
    assert.equal(other.disconnected, false);
    assert.deepEqual(await adminIds(io), [other.id]);
  });
});

test("admin join that completes after demotion does not stay in the admins room", async () => {
  const guard = createAdminRoomController();
  const userId = new mongoose.Types.ObjectId().toString();
  const rooms = new Set([`socket-${userId}`, `user_${userId}`]);
  let releaseJoin;
  const socket = {
    id: `socket-${userId}`,
    user: { _id: userId, role: "admin" },
    rooms,
    join(room) {
      return new Promise((resolve) => {
        releaseJoin = () => {
          rooms.add(room);
          resolve();
        };
      });
    },
    leave(room) {
      rooms.delete(room);
    },
    disconnect() {
      rooms.clear();
      this.disconnected = true;
    },
  };

  const pending = guard.authorizeAdminRoom(socket, async () => "admin");
  await waitFor(() => typeof releaseJoin === "function");

  const missed = {
    in() {
      return {
        fetchSockets: async () => [],
        disconnectSockets() {},
      };
    },
  };
  const sync = await guard.syncSocketAccess(missed, userId, "user");
  releaseJoin();
  const result = await pending;

  assert.equal(sync.ok, true);
  assert.equal(result.joined, false);
  assert.equal(rooms.has("admins"), false);
  assert.equal(rooms.has(`user_${userId}`), true);
});

test("promotion during an in-flight lookup still grants the admins room", async () => {
  await withServer(async (io) => {
    const guard = createAdminRoomController();
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId);

    let releaseLookup;
    let reads = 0;
    const pending = guard.authorizeAdminRoom(socket, async () => {
      reads += 1;
      if (reads === 1) {
        await new Promise((resolve) => {
          releaseLookup = resolve;
        });
        return "user";
      }
      return "admin";
    });

    await waitFor(() => typeof releaseLookup === "function");
    await guard.syncSocketAccess(io, userId, "admin");
    releaseLookup();
    const result = await pending;

    assert.equal(result.joined, true);
    assert.equal(socket.disconnected, false);
    assert.equal(socket.rooms.has("admins"), true);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
  });
});

test("a failed role lookup removes admin membership and keeps the user room", async () => {
  await withServer(async (io) => {
    const guard = createAdminRoomController();
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId, { admin: true });
    const result = await guard.authorizeAdminRoom(socket, async () => {
      throw new Error("lookup failed");
    });
    assert.equal(result.joined, false);
    assert.equal(socket.disconnected, false);
    assert.equal(socket.rooms.has("admins"), false);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
  });
});

test("repeating a role update removes admin access when the saved role already matches", async () => {
  await withServer(async (io) => {
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId, { admin: true });
    const other = attachSocket(io, `other-${userId}`, new mongoose.Types.ObjectId().toString(), { admin: true });
    let saves = 0;
    const doc = {
      _id: userId,
      role: "user",
      async save() {
        saves += 1;
      },
    };

    const res = await callUpdate(doc, "user", io);

    assert.equal(saves, 0);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.socketSync, true);
    assert.equal(res.body.user.role, "user");
    assert.equal(socket.disconnected, false);
    assert.equal(socket.rooms.has("admins"), false);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
    assert.equal(other.rooms.has("admins"), true);
  });
});

test("role is saved before socket access changes", async () => {
  await withServer(async (io) => {
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId, { admin: true });
    let sawAdminDuringSave = false;
    const doc = {
      _id: userId,
      role: "admin",
      async save() {
        sawAdminDuringSave = (await adminIds(io)).includes(socket.id);
        this.role = "user";
      },
    };

    const res = await callUpdate(doc, "user", io);

    assert.equal(sawAdminDuringSave, true);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.socketSync, true);
    assert.equal(res.body.user.role, "user");
    assert.equal(socket.rooms.has("admins"), false);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
  });
});

test("a database save failure does not report success or clear admin access", async () => {
  await withServer(async (io) => {
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId, { admin: true });
    const doc = {
      _id: userId,
      role: "admin",
      async save() {
        throw new Error("database unavailable");
      },
    };

    const res = await callUpdate(doc, "user", io);
    const followup = attachSocket(io, `follow-${userId}`, userId);
    const joined = await authorizeAdminRoom(followup, async () => "admin");

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.socketSync, undefined);
    assert.equal(socket.rooms.has("admins"), true);
    assert.equal(joined.joined, true);
    assert.equal(followup.rooms.has("admins"), true);
  });
});

test("socket cleanup failure after a saved role is a partial success and does not log the failure detail", async () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const doc = {
    _id: userId,
    role: "admin",
    async save() {
      this.role = "user";
    },
  };
  const io = {
    in() {
      return {
        fetchSockets: async () => {
          throw new Error("secret-token");
        },
        disconnectSockets() {
          throw new Error("secret-token");
        },
      };
    },
  };
  const logs = [];
  const originalError = console.error;
  console.error = (...args) => {
    logs.push(args.map((part) => String(part)).join(" "));
  };

  try {
    const res = await callUpdate(doc, "user", io);
    const output = logs.join("\n");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.socketSync, false);
    assert.equal(res.body.user.role, "user");
    assert.match(res.body.message, /Save the role again to retry/);
    assert.match(output, /Role saved but live socket access could not be updated/);
    assert.equal(output.includes("secret-token"), false);
  } finally {
    console.error = originalError;
  }
});

test("a socket that cannot leave the admins room is disconnected", async () => {
  const guard = createAdminRoomController();
  const userId = new mongoose.Types.ObjectId().toString();
  const rooms = new Set(["socket", `user_${userId}`, "admins"]);
  const socket = {
    id: "socket",
    server: true,
    user: { _id: userId },
    rooms,
    leave() {
      throw new Error("leave failed");
    },
    join() {
      throw new Error("join failed");
    },
    disconnect() {
      rooms.clear();
      this.disconnected = true;
    },
  };
  const io = {
    in(room) {
      const members = rooms.has(room) ? [socket] : [];
      return {
        fetchSockets: async () => members,
        disconnectSockets() {
          throw new Error("bulk disconnect failed");
        },
      };
    },
  };

  const sync = await guard.syncSocketAccess(io, userId, "user");

  assert.equal(sync.ok, true);
  assert.equal(socket.disconnected, true);
  assert.equal(rooms.has("admins"), false);
});

test("visible sockets lose admin access when room listing fails", async () => {
  await withServer(async (io) => {
    const guard = createAdminRoomController();
    const userId = new mongoose.Types.ObjectId().toString();
    const socket = attachSocket(io, `socket-${userId}`, userId, { admin: true });
    const wrapped = {
      sockets: io.sockets,
      in() {
        return {
          fetchSockets: async () => {
            throw new Error("list failed");
          },
          disconnectSockets() {
            throw new Error("disconnect failed");
          },
        };
      },
    };

    const sync = await guard.syncSocketAccess(wrapped, userId, "user");

    assert.equal(sync.ok, true);
    assert.equal(socket.disconnected, false);
    assert.equal(socket.rooms.has("admins"), false);
    assert.equal(socket.rooms.has(`user_${userId}`), true);
  });
});

test.after(() => {
  assert.equal(mongoose.connection.readyState, 0);
});
