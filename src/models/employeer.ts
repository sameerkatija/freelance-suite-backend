import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILocation {
  city: string;
  country: string;
}

export interface IEmployer extends Document {
  employer_name: string;
  location: ILocation;
  date: Date;
  email: String;
  password: String;
  createdBy: mongoose.Types.ObjectId;
}
const EmployerSchema: Schema = new Schema({
  employer_name: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  date: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
});

const Employer: Model<IEmployer> = mongoose.model<IEmployer>(
  "Employer",
  EmployerSchema
);

export default Employer;
