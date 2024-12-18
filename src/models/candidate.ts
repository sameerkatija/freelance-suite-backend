import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the candidate document
export interface ICandidate extends Document {
  candidate_name: string;
  position: string;
  experience: number;
  qualification: string;
  createdAt: Date;
  isApproved: boolean;
  summary: string;
  comments: mongoose.Types.ObjectId[];
  mayBeLater: boolean;
  formData: string;
  status: "SELECTED" | "NEED_MORE_INFO" | "MAYBE_LATER" | "NO" | "PENDING";
  form_id: mongoose.Types.ObjectId;
  skills: string[];
  profile_picture: string;
  role: string;
}

// Define the Mongoose schema for a candidate
const candidateSchema: Schema<ICandidate> = new Schema({
  candidate_name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    min: [0, "Experience cannot be negative"],
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  mayBeLater: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ["SELECTED", "NEED_MORE_INFO", "MAYBE_LATER", "NO", "PENDING"],
    required: true,
  },
  formData: {
    type: String,
    required: true,
  },
  form_id: { type: Schema.Types.ObjectId, ref: "Form", required: true },
  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to Comment schema
      },
    ],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  skills: {
    type: [String],
    required: false,
    default: [],
  },
  profile_picture: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "CANDIDATE",
  },
});

// Create the Mongoose model using the schema and document interface
const Candidate = mongoose.model<ICandidate>("Candidate", candidateSchema);

export default Candidate;

// Comment
