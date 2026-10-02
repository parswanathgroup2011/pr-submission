// Admin-room membership follows the role stored in MongoDB at join time.
// A role copied during the Socket.IO handshake is not authorization.
//
// Demotion can commit while a socket is waiting on its role lookup, and that
// lookup can still resolve with the previous role. The generation counter and
// the role recorded after a successful save are checked again before a join,
// including when join() yields.

const MAX_ROLE_READS = 5;

function createAdminRoomController() {
  const generations = new Map();
  const committedRoles = new Map();

  function generationOf(userId) {
    return generations.get(userId) || 0;
  }

  function commitRole(userId, role) {
    const id = String(userId);
    committedRoles.set(id, role);
    generations.set(id, generationOf(id) + 1);
    return id;
  }

  async function settle(result) {
    if (result && typeof result.then === "function") await result;
  }

  function safeDisconnect(socket) {
    try {
      socket.disconnect(true);
    } catch {
      return false;
    }
    return true;
  }

  function stillInAdminRoom(socket) {
    return Boolean(socket.rooms?.has?.("admins"));
  }

  async function leaveAdminRoom(socket) {
    try {
      await settle(socket.leave("admins"));
    } catch {
      safeDisconnect(socket);
    }
    if (stillInAdminRoom(socket)) safeDisconnect(socket);
  }

  function readIsUnstable(userId, role, generation) {
    if (generationOf(userId) !== generation) return true;
    const committed = committedRoles.get(userId);
    return Boolean(committed) && committed !== role;
  }

  function canGrantAdmin(userId, role, generation) {
    return !readIsUnstable(userId, role, generation) && role === "admin";
  }

  async function authorizeAdminRoom(socket, findRole) {
    const userId = socket?.user?._id ? String(socket.user._id) : "";
    if (!userId || typeof findRole !== "function") {
      if (socket) await leaveAdminRoom(socket);
      return { joined: false };
    }

    try {
      for (let attempt = 0; attempt < MAX_ROLE_READS; attempt += 1) {
        const generation = generationOf(userId);
        let role;
        try {
          role = await findRole(userId);
        } catch {
          await leaveAdminRoom(socket);
          return { joined: false };
        }

        if (readIsUnstable(userId, role, generation)) continue;

        const grantAdmin = role === "admin";
        try {
          if (grantAdmin) await settle(socket.join("admins"));
          else await leaveAdminRoom(socket);
        } catch {
          await leaveAdminRoom(socket);
          safeDisconnect(socket);
          return { joined: false };
        }

        if (grantAdmin && !canGrantAdmin(userId, role, generation)) {
          await leaveAdminRoom(socket);
          continue;
        }

        if (socket.user) socket.user.role = role;
        const joined = grantAdmin && (socket.rooms?.has ? stillInAdminRoom(socket) : true);
        return { joined };
      }
    } catch {
      await leaveAdminRoom(socket);
      return { joined: false };
    }

    await leaveAdminRoom(socket);
    return { joined: false };
  }

  function localSockets(io) {
    const map = io?.sockets?.sockets;
    if (!map || typeof map.values !== "function") return [];
    return [...map.values()];
  }

  async function socketsForUser(io, userId) {
    const [userSockets, adminSockets] = await Promise.all([
      io.in(`user_${userId}`).fetchSockets(),
      io.in("admins").fetchSockets(),
    ]);
    const seen = new Set();
    const matched = [];
    for (const socket of [...userSockets, ...adminSockets]) {
      if (!socket?.user || String(socket.user._id) !== userId || seen.has(socket.id)) continue;
      seen.add(socket.id);
      matched.push(socket);
    }
    return matched;
  }

  async function applyRole(socket, role) {
    try {
      await settle(socket.leave("admins"));
      if (role === "admin") await settle(socket.join("admins"));
      if (socket.user) socket.user.role = role;
    } catch {
      // Fall through to disconnect. A failed leave must not keep admin access.
    }

    if (role !== "admin" && stillInAdminRoom(socket)) {
      if (!safeDisconnect(socket) || stillInAdminRoom(socket)) {
        throw new Error("socket_cleanup_failed");
      }
    }
  }

  function matchingLocalSockets(io, userId) {
    return localSockets(io).filter((socket) => socket?.user && String(socket.user._id) === userId);
  }

  async function assertDemoted(io, userId) {
    let remaining = null;
    try {
      remaining = await io.in("admins").fetchSockets();
    } catch {
      remaining = null;
    }

    if (remaining) {
      for (const socket of remaining) {
        if (!socket?.user || String(socket.user._id) !== userId) continue;
        if (!safeDisconnect(socket) || stillInAdminRoom(socket)) {
          throw new Error("socket_cleanup_failed");
        }
      }
      return;
    }

    const locals = matchingLocalSockets(io, userId);
    if (!io?.sockets?.sockets || locals.some((socket) => stillInAdminRoom(socket) && !socket.disconnected)) {
      throw new Error("socket_cleanup_failed");
    }
  }

  async function recoverSocketAccess(io, userId, role) {
    try {
      io.in(`user_${userId}`).disconnectSockets(true);
    } catch {
      // Per-socket cleanup below still has to remove admin access.
    }

    const locals = matchingLocalSockets(io, userId);
    for (const socket of locals) await applyRole(socket, role);

    if (role !== "admin") {
      await assertDemoted(io, userId);
      return;
    }

    // A promotion could not be confirmed if no socket was visible to retry.
    if (locals.length === 0) throw new Error("socket_cleanup_failed");
  }

  async function syncSocketAccess(io, userId, role) {
    const id = commitRole(userId, role);
    if (!io) return { ok: true };

    try {
      const sockets = await socketsForUser(io, id);
      for (const socket of sockets) await applyRole(socket, role);
      if (role !== "admin") await assertDemoted(io, id);
      return { ok: true };
    } catch {
      try {
        await recoverSocketAccess(io, id, role);
        return { ok: true };
      } catch {
        return { ok: false };
      }
    }
  }

  return { authorizeAdminRoom, syncSocketAccess };
}

const shared = createAdminRoomController();

module.exports = {
  createAdminRoomController,
  authorizeAdminRoom: shared.authorizeAdminRoom,
  syncSocketAccess: shared.syncSocketAccess,
};
