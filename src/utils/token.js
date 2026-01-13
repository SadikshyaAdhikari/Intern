import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  const payload = {
    id: user.id,   
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}   

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
    throw new Error('Invalid token');
  }
}

