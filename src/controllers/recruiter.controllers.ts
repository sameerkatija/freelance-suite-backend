import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const user = await User.findOne({ _id: userId }, { password: 0, active: 0 });
  return res.status(200).json({ user });
};
export const setUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // Assuming userId is a string
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const { firstName, lastName, phoneNumber, address, notifications, timeZone } =
    req.body;
  const user = await User.updateOne(
    { _id: userId },
    {
      $set: {
        firstName,
        lastName,
        phoneNumber,
        address,
        notifications,
        timeZone,
      },
    }
  );
  const updatedUser = await User.findById(userId, { password: 0, active: 0 });
  return res.status(200).json({ user: updatedUser });
};
