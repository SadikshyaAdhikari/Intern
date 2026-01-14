import { verifyToken } from "../utils/token.js";



export const adminOnly = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = header.split(" ")[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    req.user = decoded;

    next(); // ✅ allow access
  } catch (error) {
    return res.status(500).json({ error: "Authorization failed" });
  }
};
