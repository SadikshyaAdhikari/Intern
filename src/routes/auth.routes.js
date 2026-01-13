import express from 'express';
import { registerUser } from '../controllers/auth.controllers.js';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// module.exports = router;
export default router;