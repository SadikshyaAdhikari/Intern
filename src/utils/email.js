import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
};

export const sendOtpEmail = async (email, otp) => {
  const subject = "Reset Your Password";
  const text = `
Your password reset OTP is: ${otp}

This OTP is valid for 10 minutes.
If you didn’t request this, please ignore this email.
`
;

  return sendEmail({ to: email, subject, text });
}

