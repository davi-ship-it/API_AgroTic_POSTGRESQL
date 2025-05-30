import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // smtp.gmail.com
  port: +process.env.SMTP_PORT,     // 465
  secure: true,                     // SSL/TLS
  auth: {
    user: process.env.SMTP_USER,    // tu_email@gmail.com
    pass: process.env.SMTP_PASS,    // contraseña de aplicación
  },
});
