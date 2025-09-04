const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // ✅ Allow access
  } else {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
};

module.exports = isAdmin;
