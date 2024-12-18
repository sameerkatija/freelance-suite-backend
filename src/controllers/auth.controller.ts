import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/otpLogic";
import mongoose from "mongoose";
import { sendEmail, sendPasswordResetLink } from "../utils/nodeMailer/mailer";
import OTP from "../models/otp";
import { google } from "googleapis";
import generatePassword from "../utils/generatePassword";
import Employer from "../models/employeer";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const filteredUser: any = { ...user.toObject() };
  delete filteredUser.password;
  delete filteredUser.emp;
  if (!user.active) {
    return res.status(403).json({
      message: "Account not activated. Please verify your email.",
      user: filteredUser,
    });
  }
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  res.setHeader("Authorization", `${token}`);
  return res
    .status(200)
    .json({ status: 200, message: "Login Success", user: filteredUser });
};

export const signUpController = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    active: false,
    profile_picture: req.file?.location,
  });
  await user.save();
  const otp = await generateOTP(user._id as mongoose.Types.ObjectId);
  await sendEmail(user.email, otp);
  const filteredUser: any = { ...user.toObject() };
  delete filteredUser.password;
  delete filteredUser.emp;
  return res.status(200).json({
    message: "Signup successful. OTP sent to email.",
    user: filteredUser,
  });
};

export const generateOTPController = async (req: Request, res: Response) => {
  const { email, type } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (type === "signup") {
    await OTP.deleteMany({ user: user._id });
    const otp = await generateOTP(user._id as mongoose.Types.ObjectId);
    await sendEmail(user.email, otp);
  } else {
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
    const resetLink = `https://www.selectsuite.net/reset-password/${token}`;
    await sendPasswordResetLink(user.email, resetLink);
  }

  return res.status(200).json({ message: "Email sent successfully" });
};

export const verifyOTPController = async (req: Request, res: Response) => {
  const { otp, userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const otpDoc = await OTP.findOne({ user: userId, otp });

  if (!otpDoc) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  if (otpDoc.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  user.active = true;
  await user.save();
  await OTP.findByIdAndDelete(otpDoc._id);
  return res.status(200).json({ message: "OTP verified, user activated" });
};

export const resetUserPasswordController = async (
  req: Request,
  res: Response
) => {
  const { password } = req.body;
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({ message: "Something went wrong!" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);

    const { email } = decoded as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.password = password;
    await user.save();

    if (user.emp) {
      const emp = await Employer.findOne({ email });
      if (!emp) {
        return res.status(400).json({ message: "Employer not found" });
      }
      emp.password = password;
      await emp.save();
    }

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).send("Invalid or expired token");
  }
};

// Sign in with Google

// Replace these with your actual Google OAuth credentials
const CLIENT_ID = process.env.CLIENT_ID as string;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];
// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  process.env.CLIETN_SECRET as string,
  REDIRECT_URI
);

export const getGooglePage = (req: Request, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  res.redirect(authUrl);
};

export const googleCallBackHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const profile = await oauth2.userinfo.get();
    const { email, given_name, family_name } = profile.data;
    let user = await User.findOne({ email });

    if (!user) {
      const password = generatePassword(8);
      user = new User({
        email,
        firstName: given_name,
        lastName: family_name,
        active: true,
        password,
      });
      await user.save();
    }
    const filteredUser: any = { ...user.toObject() };
    delete filteredUser.password;
    delete filteredUser.emp;
    if (!user.active) {
      user.active = true;
      await user.save();
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.setHeader("Authorization", `${token}`);
    return res
      .status(200)
      .json({ status: 200, message: "Login Success", user: filteredUser });
  } catch (e) {
    res.status(500).send({ message: "Error retrieving user profile: " });
  }
};
