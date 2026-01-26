import { verifyToken } from "../utils/token.js";

export const superAdminOnly = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (decoded.role !== "sudo") {
      return res.status(403).json({ error: "Super Admin only" });
    }

    req.user = decoded;

    next(); 
  } catch (error) {
    return res.status(500).json({ error: "Authorization failed" });
  }
};
