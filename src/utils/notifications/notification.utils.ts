import mongoose from "mongoose";
import Notification, { INotification } from "../../models/notification";
import { Server } from "socket.io";
// this will create a notification
export const createNotification = async (
  userId: string,
  message: string,
  type: string
): Promise<INotification> => {
  const notification = new Notification({
    userId: new mongoose.Types.ObjectId(userId),
    message,
    type,
  });
  const savedNotification = await notification.save();
  return savedNotification;
};

export const generateNotification = async (
  io: Server,
  userId: string,
  message: string,
  type: string
) => {
  const notification = await createNotification(userId, message, type);
  io.emit("notification", notification);
};

// export const formSubmittedNotification = async (
//   io: Server,
//   userId: string,
//   message: string,
//   type: string = "New Form"
// ) => {
//   const notification = await createNotification(userId, message, type);
//   io.emit("New Form", notification);
// };

// export const commentNotification = async (
//   io: Server,
//   userId: string,
//   message: string,
//   type: string = "Commented"
// ) => {
//   const notification = await createNotification(userId, message, type);
//   console.log(notification);
//   io.emit("Commented", notification);
// };

// export const selectedCandidateNotification = async (
//   io: Server,
//   userId: string,
//   message: string,
//   type: string = "Selected"
// ) => {
//   const notification = await createNotification(userId, message, type);
//   io.emit("Selected", notification);
// };
// export const savedCandidateNotification = async (
//   io: Server,
//   userId: string,
//   message: string,
//   type: string = "Saved"
// ) => {
//   const notification = await createNotification(userId, message, type);
//   io.emit("Saved", notification);
// };
