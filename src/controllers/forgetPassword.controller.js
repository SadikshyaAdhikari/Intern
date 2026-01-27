
import crypto from "crypto";
import { findUserByEmail } from "../models/user.model.js";
import { createOtp, findValidOtp, invalidateOldOtps, markOtpAsUsed } from "../models/otp.model.js";
import { sendOtpEmail } from "../utils/email.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    //  Find user
    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({
        message: "If the email exists, an OTP has been sent"
      });
    }

    //  Invalidate old OTPs
    await invalidateOldOtps(user.id, "FORGOT_PASSWORD");

    //  Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Hash OTP
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Save OTP
    await createOtp({
      userId: user.id,
      otpHash,
      purpose: "FORGOT_PASSWORD",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    });

    // 6. Send email
    await sendOtpEmail(user.email, otp);
    console.log(otp)
    return res.json({
      message: "If the email exists, an OTP has been sent"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find the user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the incoming OTP (because OTP is stored hashed in DB)
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Find the valid OTP record
    const otpRecord = await findValidOtp(user.id, otpHash, "FORGOT_PASSWORD");

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    //  Mark OTP as used
    await markOtpAsUsed(otpRecord.id);

    //  Generate temporary reset token (to allow password reset)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //  Save reset token and expiry in users table
    const query = `
      UPDATE users
      SET reset_token = $1,
          reset_token_expires = NOW() + INTERVAL '10 minutes'
      WHERE id = $2
    `;
    await db.none(query, [resetTokenHash, user.id]);

    //  Return reset token to client
    return res.json({
      message: "OTP verified successfully",
      resetToken
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
