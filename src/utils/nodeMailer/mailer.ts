require("dotenv").config();
import nodemailer from "nodemailer";
import logger from "../logger/winston";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendEmail = (emailTo: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      logger.log({
        level: "error",
        message: error.message,
        error,
      });
    } else {
      logger.log({
        level: "info",
        message: info.response,
      });
    }
  });
};

export const sendPassword = (emailTo: string, password: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject: "Account Creation Successful",
    text: `Please find your SelectSuite credentials below. You can sign in using this email and password.
    
    Email: ${emailTo}
    Password: ${password}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      logger.log({
        level: "error",
        message: error.message,
        error,
      });
    } else {
      logger.log({
        level: "info",
        message: info.response,
      });
    }
  });
};

export const sendPasswordResetLink = (emailTo: string, resetLink: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: ${resetLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      logger.log({
        level: "error",
        message: error.message,
        error,
      });
    } else {
      logger.log({
        level: "info",
        message: info.response,
      });
    }
  });
};
