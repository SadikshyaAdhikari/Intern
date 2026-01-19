import express from 'express';
import { refreshToken, registerUser } from '../controllers/auth.controllers.js';
import { loginUser } from '../controllers/auth.controllers.js';
import { deleteUser } from '../controllers/auth.controllers.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { viewMyDetails } from '../controllers/auth.controllers.js';
import { userOnly } from '../middleware/userOnly.js';
import { verifyRefreshTokenMiddleware } from '../middleware/verifyTokenMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Registration route
router.post('/register', registerUser);

//Login route
router.post('/login', loginUser);

//Delete user route
router.delete('/delete/:id', adminOnly, deleteUser);


//view my details
// router.post('/me', viewMyDetails);
router.get('/me/:id',authMiddleware, userOnly, viewMyDetails);

//refresh token route
router.post('/refresh-token', verifyRefreshTokenMiddleware ,refreshToken);

// module.exports = router;
export default router;