const Notification = require("../Models/Notification");


exports.createNotification = async (userId, role, title, message) => {
  try {
    const result = await Notification.create({
      userId,
      role,
      title,
      message
    });

    console.log("🔔 NOTIFICATION SAVED:", title, "→", role);

    // 📡 REAL-TIME EMIT TO USERS
    if (userId) {
      // send notification to that user's room
      global.io.to(`user_${userId}`).emit("newNotification", {
        _id: result._id,
        title,
        message,
        role,
        createdAt: result.createdAt,
      });
    }

    // 📡 REAL-TIME EMIT TO ADMINS
    if (role === "admin") {
      global.io.to("admins").emit("newNotification", {
        _id: result._id,
        title,
        message,
        role,
        createdAt: result.createdAt,
      });
    }

    return result;

  } catch (err) {
    console.error("❌ Notification Error:", err);
  }
};
