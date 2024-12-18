import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the Notification interface and schema

interface INotification {
  new_candidate: boolean;
  new_selection: boolean;
  new_comment: boolean;
  watchlist_addition: boolean;
  pushNotification: boolean;
  emailNotification: boolean;
}

interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  active: boolean;
  address?: string;
  notifications?: INotification;
  timeZone?: string;
  role: string;
  profile_picture: String;
  emp?: mongoose.Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}

const NotificationSchema = new Schema<INotification>({
  new_candidate: {
    type: Boolean,
    default: false,
    required: false,
  },
  new_selection: {
    type: Boolean,
    default: false,
    required: false,
  },
  new_comment: {
    type: Boolean,
    default: false,
    required: false,
  },
  watchlist_addition: {
    type: Boolean,
    default: false,
    required: false,
  },
  pushNotification: {
    type: Boolean,
    default: false, // Whether the user wants push notifications
  },
  emailNotification: {
    type: Boolean,
    default: false, // Whether the user wants email notifications
  },
});

const UserSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: false,
    minlength: [1, "First name is required"],
    maxlength: [50, "First name cannot exceed 50 characters"],
  },
  lastName: {
    type: String,
    required: false,
    minlength: [1, "Last name is required"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },
  phoneNumber: {
    type: String,
    required: false,
    minlength: [10, "Phone number must be at least 10 digits"],
    maxlength: [15, "Phone number cannot exceed 15 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  active: {
    type: Boolean,
    default: false, // Default is false until the user verifies the email
  },
  address: {
    type: String,
    required: false, // Make this optional based on your requirements
  },
  notifications: NotificationSchema,
  timeZone: {
    type: String,
    required: false, // Adjust based on whether you want to make it required
  },
  role: {
    type: String,
    enum: ["RECRUITER", "EMPLOYER"],
    default: "RECRUITER",
  },
  emp: {
    type: Schema.Types.ObjectId,
    ref: "Emp",
    required: false,
  },
  profile_picture: {
    type: String,
    required: false,
  },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
