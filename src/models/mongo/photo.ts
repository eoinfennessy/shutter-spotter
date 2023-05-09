import Mongoose from "mongoose";
import { MongooseVersion, NewPhoto } from "../../types/schemas";

const { Schema } = Mongoose;

const photoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: { type: String, required: true },
  tags: { type: Array, required: true },
  comments: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: { type: String, required: true },
    },
  ],
  votes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      vote: { type: Number, required: true },
    },
  ],
  voteScore: { type: Number, required: true },
  timeCreated: { type: String, required: true },
});

export const PhotoMongoose = Mongoose.model<NewPhoto & MongooseVersion>("Photo", photoSchema);
