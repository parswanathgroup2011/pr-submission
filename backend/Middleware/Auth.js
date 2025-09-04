const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(403).json({ message: "Unauthorized. JWT token is required" });
  }

  const token = authHeader.split(' ')[1]; // ✅ Extract only the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Now decode the actual token
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized JWT token is invalid or expired" });
  }
};

module.exports = ensureAuthenticated;
