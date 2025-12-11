import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  let payload = null;
  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Invalid token");
    return null;
  }

  // If already connected, return same socket
  if (socket) return socket;

  // Create socket connection
  socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    transports: ["websocket"],
    query: {
      userId: payload._id,
      role: payload.role,
    },
  });

  socket.on("connect", () => {
    console.log("🔌 Socket Connected:", payload._id, payload.role);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected");
  });

  return socket;
};

// export socket instance
export { socket };
