import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET loaded:', JWT_SECRET);

export const generateToken = (user) => {
  const payload = {
    id: user.id,   
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}   

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
    } catch (error) {
    throw new Error('Invalid token');
  }
}

export const generateRefreshToken = (accessToken) => {
  try {

    const decoded = jwt.verify(accessToken, JWT_SECRET, { ignoreExpiration: true });
    delete decoded.iat;
    delete decoded.exp;
    return jwt.sign(decoded, JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    throw new Error('Invalid token');
  } 
}

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
    } catch (error) {
    throw new Error('Invalid refresh token');
  }
}



