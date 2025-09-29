// backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole =
  (allowedRoles = []) =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    const roles = Array.isArray(req.user.roles) ? req.user.roles : [];
    const ok =
      allowedRoles.length === 0 || allowedRoles.some((r) => roles.includes(r));
    if (!ok) return res.status(403).json({ message: "Forbidden" });
    next();
  };

module.exports = { verifyToken, requireRole };
