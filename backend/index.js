const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const User = require("./Models/Users");
const { authorizeAdminRoom } = require("./socket/adminRoom");

require('dotenv').config();
require('./Models/db');

// Import routes
const AuthRouter = require('./Routes/AuthRouter');
const pressReleaseRoutes = require('./Routes/pressReleaseRoutes');
const prCategoryRoutes = require('./Routes/prCategoryRoutes');
const planRoutes = require('./Routes/planRoutes');
const ProductRouter = require('./Routes/ProductRouter');
const walletRoutes = require('./Routes/walletRoutes');
const downloadPR = require("./Routes/Downloadpr")
const adminWallets = require("./Routes/AdminWallet")
const ManualTopUp= require("./Routes/manualTopup")
const AdminManualtopup=require("./Routes/AdminManualtopup")
const notificationRoutes = require("./Routes/notificationRoutes");
const fileRoutes = require("./Routes/fileRoutes");

// PORT
const PORT = process.env.PORT || 5002;

// Origins allowed to call the API and open a socket
const ALLOWED_ORIGINS = (
  process.env.CORS_ORIGINS || "http://localhost:5173,https://pr.timesofkashi.in"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Uploads hold KYC documents and payment screenshots, so they are served only
// through the authenticated /api/files route rather than as static assets.

// Middleware must be registered before any route so every response is covered.
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser callers (curl, health checks) which send no Origin
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      // Omit the header rather than throwing, so the browser blocks the response
      // without the API returning a 500.
      return callback(null, false);
    },
    credentials: true,
  })
);

// Test route
app.get('/api/yash', (req, res) => {
  res.send('vyas');
});

// Routers
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/api/pr-category', prCategoryRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/wallet', ManualTopUp);
app.use("/api/press-releases/download", downloadPR);
app.use("/api/admin", adminWallets);
app.use("/api/admin", AdminManualtopup);
app.use("/api/files", fileRoutes);
app.use("/api", notificationRoutes);

// Converts upload and parser failures into JSON instead of letting Express
// return a stack trace that exposes server paths.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 20MB."
        : "File upload failed.";
    return res.status(400).json({ message, success: false });
  }

  if (err?.message?.startsWith("Only images")) {
    return res.status(400).json({ message: err.message, success: false });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error", success: false });
});


// ------------------------------------------------------
// 1️⃣ CREATE HTTP SERVER (REQUIRED FOR SOCKET.IO)
// ------------------------------------------------------
const server = http.createServer(app);

// ------------------------------------------------------
// 2️⃣ ATTACH SOCKET.IO
// ------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make socket available globally (for controllers)
global.io = io;

// Reject the handshake unless the JWT is valid and the user still exists.
// This middleware does not copy a role onto the socket. Admin-room membership
// is decided from a later role lookup, so a demotion during or after the
// handshake cannot be reused to join the admins room.
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?._id || !mongoose.isValidObjectId(decoded._id)) {
      return next(new Error("Unauthorized"));
    }

    const user = await User.findById(decoded._id).select("_id");
    if (!user) return next(new Error("Unauthorized"));

    socket.user = { _id: String(user._id) };
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?._id;
  if (!userId) return;

  console.log("🔌 Socket Connected:", userId);
  socket.join(`user_${userId}`);

  authorizeAdminRoom(socket, async (id) => {
    const user = await User.findById(id).select("role");
    return user ? user.role : null;
  }).catch(() => {
    try {
      socket.leave("admins");
    } catch {
      try {
        socket.disconnect(true);
      } catch {
        // The role lookup failed and this socket could not be updated.
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", userId);
  });
});

// ------------------------------------------------------
// 4️⃣ START SERVER WITH SOCKET.IO (NOT app.listen)
// ------------------------------------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
