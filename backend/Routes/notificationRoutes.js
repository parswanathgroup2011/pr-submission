const express = require("express");
const router = express.Router();

const auth = require("../Middleware/Auth");
const isAdmin = require("../Middleware/isAdmin");

const NotificationController = require("../Controllers/NotificationController");

// USER — fetch notifications
router.get("/user/notifications", auth, NotificationController.getUserNotifications);

// ADMIN — fetch notifications
router.get("/admin/notifications", auth, isAdmin, NotificationController.getAdminNotifications);

// Mark notification as read
router.put("/notifications/read/:id", auth, NotificationController.markAsRead);

module.exports = router;
