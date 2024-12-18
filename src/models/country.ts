import mongoose, { Document, Schema } from "mongoose";

// Define an interface representing a document in MongoDB.
interface ICountry extends Document {
  name: string;
  code: string;
}

// Create a schema for the Country model.
const countrySchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

// Create a model based on the schema and interface.
const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
