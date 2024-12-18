// models/Notification.ts
import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  message: string; // Notification message
  createdAt: Date; // Timestamp of creation
  isRead: boolean; // Status of the notification
  type: "Commented" | "Selected" | "Saved" | "New Form";
}

const notificationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", // Assuming you have a User model
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["Commented", "Selected", "Saved", "New Form"],
  },
});

// Create the model
const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
