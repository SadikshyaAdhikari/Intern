import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

export const seedSudoAdmin = async()=>{
    try{
        const username = "Super Admin";
        const email = "superadmin@gmail.com";
        const password = "Superadmin@123";
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = "sudo";

        const existing = await db.oneOrNone('SELECT * FROM users WHERE email = $1',[email]);
        if(existing){
            console.log("User already exists!")
            return;
        }

        const newUser = await db.one(
      `INSERT INTO users (username, email, password, role, token, refresh_token)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, role`,
      [username, email, hashedPassword, role, '', '']
    );

    console.log('Sudo admin created:', newUser);
  } catch (err) {
    console.error('Error seeding sudo admin:', err);
  }
};

//     // Generate access token and refresh token for superadmin
//     const accessToken = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
//     const refreshToken = generateRefreshToken(accessToken);

//     // Update user with tokens in database
//     const updatedUser = await db.one(
//       `UPDATE users
//        SET token = $1, refresh_token = $2
//        WHERE id = $3
//        RETURNING id, username, email, role, token, refresh_token`,
//       [accessToken, refreshToken, newUser.id]
//     );

//     console.log('Sudo admin created:', updatedUser);
//     console.log('Access Token:', accessToken);
//     console.log('Refresh Token:', refreshToken);
//   } catch (err) {
//     console.error('Error seeding sudo admin:', err);
//   }
// };