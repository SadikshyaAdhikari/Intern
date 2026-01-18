import { db } from "../config/db.js";

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      token VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  return db.none(query);
};

// Insert a new user
export const insertUser = async (username, email, hashedPassword, role, token) => {
  const query = `
    INSERT INTO users (username, email, password, role, token)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  return db.one(query, [username, email, hashedPassword, role, token]);
};

export const insertToken = async (token, userId ) => {
  const query = `
    UPDATE users  
    SET token = $1
    WHERE id = $2
    RETURNING *;
  `;
  return db.one(query, [token, userId]);
}


// Find user by email
export const findUserByEmail = async (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

// Delete user by id
export const deleteUserById = async (id) => {
  return db.none('DELETE FROM users WHERE id = $1', [id]);
};


// Find user by id
export const findUserById = async (id) => {
  return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};

//view my details
export const getUserDetails = async (id) => {
  return db.oneOrNone('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
};