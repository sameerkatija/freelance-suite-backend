import mongoose, { Model, Schema, Document } from "mongoose";

export interface IOTP extends Document {
  user: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OTP: Model<IOTP> = mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
