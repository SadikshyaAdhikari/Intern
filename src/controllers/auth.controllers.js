import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { deleteUserById, findUserByEmail, insertUser } from '../models/user.model.js';
import { generateToken } from '../utils/token.js';

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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }   
        const token = generateToken(user);
        res.status(200).json({ 
            message: 'Login successful',
            token 
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
         // Ensure user exists before deletion
        const deletedUser = await deleteUserById(userId);
        console.log('Deleted user:', deletedUser);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Deletion failed' });
    }
}
