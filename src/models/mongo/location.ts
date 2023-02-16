import Mongoose from "mongoose";
import { NewLocation } from "../store-types";

const { Schema } = Mongoose;

const locationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export const LocationMongoose = Mongoose.model<NewLocation>("Location", locationSchema);
