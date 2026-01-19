import { verifyToken, verifyRefreshToken, generateToken, generateRefreshToken } from "../utils/token.js";
import { findUserById, insertRefreshToken } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // Try access token first
    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken);
        const user = await findUserById(decoded.id);

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        

        req.user = { id: user.id };
        return next();
      } catch (err) {
        // Only continue to refresh logic if token expired
        if (err.message !== "Invalid token") {
          return res.status(401).json({ error: "Invalid access token. please re run" });
        }
      }
    }

    // Access token missing or expired → try refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Session expired" });
    }

    // Verify refresh token using your utils
    const decodedRefresh = verifyRefreshToken(refreshToken);
    const user = await findUserById(decodedRefresh.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Generate new tokens (using your existing utils)
    const newAccessToken = generateToken(user);  

    //Use the **same refresh token generation method** from your utils
    // It expects an access token as input
    const newRefreshToken = generateRefreshToken(newAccessToken); 

    await insertRefreshToken(newRefreshToken, user.id);

    // Set cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    req.user = { id: user.id };
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};
