import { io } from "socket.io-client";

function closeClient(client) {
  if (!client) return;
  // Replace the handshake callback before closing so a late reconnect cannot
  // send the token this client was opened with.
  client.auth = (callback) => callback({});
  try {
    if (typeof client.io?.reconnection === "function") client.io.reconnection(false);
  } catch {
    // A test double or already-closed manager may not expose this control.
  }
  try {
    client.disconnect();
  } catch {
    // Logout still has to drop the session if the client is already closed.
  }
}

export function createSocketSession({ createClient, readToken }) {
  let socket = null;
  let activeToken = null;

  function disconnectSocket() {
    const current = socket;
    activeToken = null;
    socket = null;
    closeClient(current);
  }

  function connectSocket() {
    const token = readToken();
    if (!token) {
      disconnectSocket();
      return null;
    }
    if (socket && activeToken === token) return socket;

    disconnectSocket();
    activeToken = token;
    const sessionToken = token;
    socket = createClient((callback) => {
      const current = readToken();
      if (!current || current !== sessionToken || current !== activeToken) {
        callback({});
        return;
      }
      callback({ token: current });
    });

    socket.on("connect", () => {
      console.log("🔌 Socket Connected");
    });
    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
    });

    return socket;
  }

  return { connectSocket, disconnectSocket };
}

let socket = null;

const browserSession = createSocketSession({
  readToken: () => {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem("authToken");
  },
  createClient: (auth) => {
    const baseUrl = import.meta.env?.VITE_API_URL || "";
    return io(baseUrl.replace("/api", ""), {
      transports: ["websocket"],
      auth,
    });
  },
});

export const connectSocket = () => {
  socket = browserSession.connectSocket();
  return socket;
};

export const disconnectSocket = () => {
  browserSession.disconnectSocket();
  socket = null;
};

export { socket };
