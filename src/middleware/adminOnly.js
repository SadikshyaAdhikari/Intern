export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== "admin" && req.user.role !== "sudo") {
      return res.status(403).json({ error: "Admins only" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ error: "Authorization failed" });
  }
};
