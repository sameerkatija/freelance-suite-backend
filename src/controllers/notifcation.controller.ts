import mongoose from "mongoose";
import Notification from "../models/notification";
import { Request, Response } from "express";
import User from "../models/user";
export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ message: "Unauthorized - Missing user ID" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const notifications = await Notification.find({});
  return res.status(200).json({ notifications });
};
