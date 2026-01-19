import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token.js"

export const accessTokenMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Access token expired",
      code: "ACCESS_TOKEN_EXPIRED"
    });
  }
};
