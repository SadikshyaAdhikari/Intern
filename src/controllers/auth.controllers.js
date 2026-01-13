import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { insertUser } from '../models/user.model.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser(username, email, hashedPassword);
    res.status(201).json({ 
       user: {newUser},
        message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  } 
}