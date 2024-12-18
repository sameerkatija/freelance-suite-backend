import mongoose from "mongoose";
import OTP, { IOTP } from "../models/otp";

const generateOTP = async (
  id: mongoose.Types.ObjectId,
  length: number = 6
): Promise<string> => {
  const digits: string = "0123456789";
  let otp: string = "";

  for (let i: number = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  const userOTP: IOTP = new OTP({
    user: id,
    otp,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour expiration
    createdAt: new Date(Date.now()), // Current time
  });

  await userOTP.save();
  return otp;
};

export default generateOTP;
