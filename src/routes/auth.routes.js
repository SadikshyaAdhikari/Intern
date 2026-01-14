import express from 'express';
import { registerUser } from '../controllers/auth.controllers.js';
import { loginUser } from '../controllers/auth.controllers.js';
import { deleteUser } from '../controllers/auth.controllers.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

//Login route
router.post('/login', loginUser);
//view my details
// /me
//whoeever calls it should get its informtation(token)
//if token expired, it should not give access
//Delete user route
router.delete('/delete/:id', adminOnly, deleteUser);

// module.exports = router;
export default router;