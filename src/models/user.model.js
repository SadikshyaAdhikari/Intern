import { db } from "../config/db.js";

export async function createUserTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      address TEXT,
      email VARCHAR(150) NOT NULL
    );
  `;

  try {
    await db.none(query);
    console.log("users table created in 'hello' database");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  }
}
