import test from "node:test";
import assert from "node:assert/strict";
import { createSocketSession } from "./socket.js";

function createHarness() {
  const clients = [];
  let storedToken = null;

  function createClient(auth) {
    const client = {
      auth,
      handshakeAuth: auth,
      connected: true,
      io: {
        opts: { reconnection: true },
        reconnection(value) {
          this.opts.reconnection = value;
          return this;
        },
      },
      listeners: {},
      disconnects: 0,
      on(event, listener) {
        this.listeners[event] = listener;
      },
      disconnect() {
        this.disconnects += 1;
        this.connected = false;
      },
    };
    clients.push(client);
    return client;
  }

  const session = createSocketSession({
    createClient,
    readToken: () => storedToken,
  });

  return {
    clients,
    session,
    setToken(token) {
      storedToken = token;
    },
    presentedToken(client) {
      let payload;
      client.handshakeAuth((data) => {
        payload = data;
      });
      return payload;
    },
  };
}

test("logout disconnects and a reconnect cannot present the previous token", () => {
  const harness = createHarness();
  harness.setToken("token-a");
  const client = harness.session.connectSocket();

  assert.deepEqual(harness.presentedToken(client), { token: "token-a" });

  harness.session.disconnectSocket();

  assert.equal(client.disconnects, 1);
  assert.equal(client.io.opts.reconnection, false);
  assert.deepEqual(harness.presentedToken(client), {});

  harness.setToken(null);
  assert.deepEqual(harness.presentedToken(client), {});
  assert.equal(harness.session.connectSocket(), null);
  assert.equal(harness.clients.length, 1);
});

test("reconnect while the same session is active presents the current token", () => {
  const harness = createHarness();
  harness.setToken("token-a");
  const client = harness.session.connectSocket();

  assert.deepEqual(harness.presentedToken(client), { token: "token-a" });
  assert.deepEqual(harness.presentedToken(client), { token: "token-a" });
  assert.equal(harness.session.connectSocket(), client);
  assert.equal(harness.clients.length, 1);
  assert.equal(client.disconnects, 0);
});

test("logging in as a different user authenticates only the new token", () => {
  const harness = createHarness();
  harness.setToken("token-a");
  const first = harness.session.connectSocket();

  harness.session.disconnectSocket();
  harness.setToken("token-b");
  const second = harness.session.connectSocket();

  assert.notEqual(second, first);
  assert.equal(first.disconnects, 1);
  assert.equal(first.io.opts.reconnection, false);
  assert.deepEqual(harness.presentedToken(first), {});
  assert.deepEqual(harness.presentedToken(second), { token: "token-b" });
  assert.equal(harness.session.connectSocket(), second);
});

test("a stored token is ignored until connect and is dropped when it disappears", () => {
  const harness = createHarness();

  assert.equal(harness.session.connectSocket(), null);
  assert.equal(harness.clients.length, 0);

  harness.setToken("token-a");
  const client = harness.session.connectSocket();
  harness.setToken(null);

  assert.equal(harness.session.connectSocket(), null);
  assert.equal(client.disconnects, 1);
  assert.deepEqual(harness.presentedToken(client), {});
});
