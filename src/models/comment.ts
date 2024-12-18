import mongoose, { Document, Schema } from "mongoose";

export interface IComments extends Document {
  comment: string;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const CommentSchema: Schema<IComments> = new Schema({
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the Mongoose model using the schema and document interface
const Comment = mongoose.model<IComments>("Comment", CommentSchema);

export default Comment;
