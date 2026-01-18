import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { deleteUserById, findUserByEmail, getUserDetails, insertRefreshToken, insertToken, insertUser} from '../models/user.model.js';
import { generateRefreshToken, generateToken} from '../utils/token.js';

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
        const accessToken = generateToken(user);
        // console.log('Generated token:', token);

        const insertedTokenUser = await insertToken(accessToken, user.id);
        console.log('Updated user with token:', insertedTokenUser);

        //refresh token
         const refreshToken = generateRefreshToken(accessToken);
         console.log('Generated refresh token:', refreshToken);
         const updatedUserWithRefreshToken = await insertRefreshToken(refreshToken, user.id);
          console.log('Updated user with refresh token:', updatedUserWithRefreshToken);


        res.status(200).json({ 
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}




export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    

    const deletedUser = await deleteUserById(userId);
   

    res.status(200).json({ 
        deleteUser,
        message: "User deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed" });
  }
};


export const viewMyDetails = async (req, res) => {
    console.log(req.body)
  try {
    // const userId = req.body.id;
    const userId = req.params.id;

    
    console.log('Fetching details for user ID:', userId);
    const userDetails = await getUserDetails(userId);

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: userDetails });
    } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user details" });
    }
};
