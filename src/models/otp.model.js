import { db } from "../config/db.js";

export const createOtpTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,

        user_id INTEGER NOT NULL,
        
        otp_hash TEXT NOT NULL,           
        purpose VARCHAR(50) NOT NULL,      
        
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,

        attempt_count INTEGER DEFAULT 0,  
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            );
  `;
  return db.none(query);
};