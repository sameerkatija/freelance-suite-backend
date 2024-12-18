import mongoose, { Document, Schema } from "mongoose";

// Define an interface representing a city document
interface ICity extends Document {
  name: string;
  country: string;
}

// Define the schema
const citySchema: Schema<ICity> = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

// Create and export the model
const City = mongoose.model<ICity>("City", citySchema);
export default City;
