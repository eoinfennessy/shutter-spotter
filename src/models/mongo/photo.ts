import Mongoose from "mongoose";
import { NewPhoto, NewPhotoWithRefs } from "../store-types";

const { Schema } = Mongoose;

const photoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },
});

export const PhotoMongoose = Mongoose.model<NewPhotoWithRefs>("Photo", photoSchema);
