const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');                 // <-- ADD THIS
const { Server } = require("socket.io");      // <-- ADD THIS

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

// PORT
const PORT = process.env.PORT || 5002;

// Test route
app.get('/api/yash', (req, res) => {
  res.send('vyas');
});

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
app.use("/api", notificationRoutes);


// ------------------------------------------------------
// 1️⃣ CREATE HTTP SERVER (REQUIRED FOR SOCKET.IO)
// ------------------------------------------------------
const server = http.createServer(app);

// ------------------------------------------------------
// 2️⃣ ATTACH SOCKET.IO
// ------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",   // your React dev server
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make socket available globally (for controllers)
global.io = io;

// ------------------------------------------------------
// 3️⃣ SOCKET CONNECTION HANDLER
// ------------------------------------------------------
io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.query;

  console.log("🔌 Socket Connected:", userId, role);

  // Join individual user room
  if (userId) socket.join(`user_${userId}`);

  // Join admin room
  if (role === "admin") socket.join("admins");

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
