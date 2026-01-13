import express from 'express';
import { registerUser } from '../controllers/auth.controllers.js';
import { loginUser } from '../controllers/auth.controllers.js';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

//Login route
router.post('/login', loginUser);

// module.exports = router;
export default router;