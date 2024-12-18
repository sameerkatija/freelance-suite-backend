import mongoose, { Document, Schema, Types } from "mongoose";
import { boolean } from "zod";

export interface IForm extends Document {
  createdBy: Types.ObjectId;
  name: string;
  description: string;
  form_pages: any[];
  isActive?: boolean;
  submission?: number;
  created_at: Date;
}

const FormSchema: Schema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  form_pages: {
    type: Array,
    default: [],
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  submission: {
    type: Number,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model<IForm>("Form", FormSchema);

export default Form;
