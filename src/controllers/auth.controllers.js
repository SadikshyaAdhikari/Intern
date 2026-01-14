import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { deleteUserById, findUserByEmail, insertToken, insertUser} from '../models/user.model.js';
import { generateToken, verifyToken } from '../utils/token.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; 
    const token = generateToken({ id: null, email, role });
    // console.log(req.body);

    const user = await findUserByEmail(email);
    if (user) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser(username, email, hashedPassword, role, token);
    console.log('Registered new user:', newUser);
    
    
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
        console.log('User logged in:', user); 
        const token = generateToken(user);
        console.log('Generated token:', token);

        const insertedTokenUser = await insertToken(token, user.id);
        console.log('Updated user with token:', insertedTokenUser);

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
        // const token=req.headers.authorization?.split(' ')[1];
        // const decoded = verifyToken(token);
        // console.log('Decoded token for deletion:', decoded);
        const userId = req.params.id;
        console.log('User ID to delete:', userId);
         // Ensure user exists before deletion
        const deletedUser = await deleteUserById(userId);
        console.log('Deleted user:', deletedUser);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Deletion failed' });
    }
}
