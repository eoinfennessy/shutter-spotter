import Mongoose from "mongoose";
import { MongooseVersion, NewLocation } from "../../types/schemas";

const { Schema } = Mongoose;

const locationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timeCreated: { type: String, required: true },
});

export const LocationMongoose = Mongoose.model<NewLocation & MongooseVersion>("Location", locationSchema);
