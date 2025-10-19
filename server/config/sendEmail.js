import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,     
    pass: process.env.USERPASS,   
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


export const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Montaser E-Commerce" <${process.env.EMAIL}>`,
      to: sendTo,
      subject,
      html,
    });

    console.log(" Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error;
  }
};
