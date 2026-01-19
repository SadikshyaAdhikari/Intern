// import { refreshToken } from "../controllers/auth.controllers.js";
// import { verifyToken } from "../utils/token.js";

// export const userOnly = (req, res, next) => {
//   try {
// // console.log('Cookies: ', req.cookies)
// const token = req.cookies.accessToken;
// console.log('Access Token from cookies:', token);
    

//     let decoded;
//     try {
//       decoded = verifyToken(token);
//       console.log("Decoded token:", decoded);
//     } catch {
//       return res.status(401).json({ error: "Invalid or expired token" });
//     }

//     // Only allow valid users
//     if (!decoded?.id) {
//       return res.status(403).json({ error: "Unauthorized user" });
//     }

//     //user can access ONLY their own data
//     if (
//       !req.params.id ||
//       Number(req.params.id) !== Number(decoded.id)
//     ) {
//       return res.status(403).json({ error: "Access denied" });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(500).json({ error: "Authorization failed" });
//   }
// };


export const userOnly = (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  if (
    !req.params.id ||
    Number(req.params.id) !== Number(req.user.id)
  ) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};
