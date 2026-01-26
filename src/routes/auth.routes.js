import express from 'express';
import { logoutUser, logoutFromAllDevices, refreshToken, registerUser } from '../controllers/auth.controllers.js';
import { loginUser } from '../controllers/auth.controllers.js';
import { deleteUser } from '../controllers/auth.controllers.js';
import { adminOnly } from '../middleware/adminOnly.js';
// import { superAdminOnly } from '../middleware/superAdminOnly.js';
import { viewMyDetails } from '../controllers/auth.controllers.js';
import { userOnly } from '../middleware/userOnly.js';
import { verifyRefreshTokenMiddleware } from '../middleware/verifyTokenMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Registration route
router.post('/register', registerUser);

//Login route
router.post('/login', loginUser);

//Delete user route - Only superadmin can delete users
router.delete('/delete/:id', authMiddleware, deleteUser);


//view my details
// router.post('/me', viewMyDetails);
router.get('/me/:id',authMiddleware, userOnly, viewMyDetails);

//refresh token route
router.post('/refresh-token', verifyRefreshTokenMiddleware ,refreshToken);

//logout route
router.post('/logout', logoutUser);

//logout from all devices route
router.post('/logout-all-devices', authMiddleware, logoutFromAllDevices);

// module.exports = router;
export default router;