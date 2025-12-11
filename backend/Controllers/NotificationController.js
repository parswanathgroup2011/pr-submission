const Notification = require("../Models/Notification");

// Get notifications for user
exports.getUserNotifications = async (req, res) => {
  try {
    console.log("User requesting notifications:", req.user._id);
    const list = await Notification.find({ userId: req.user._id, role: "user" })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get notifications for admin
exports.getAdminNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ role: "admin" })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.json({ message: "Marked as read" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
