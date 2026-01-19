import { verifyRefreshToken } from "../utils/token.js";
import { findUserById } from "../models/user.model.js";

export const verifyRefreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // console.log('Refresh Token from cookies:', refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    // console.log("Decoded refresh token:", decoded);

    const user = await findUserById(decoded.id);
    // console.log("User found for refresh token:", user);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    req.user = user;

    next();
  } catch (error) {
    // console.error("Error refreshing token:", error);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
