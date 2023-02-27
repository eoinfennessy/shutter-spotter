import Mongoose from "mongoose";
import { MongooseVersion, NewUser } from "../store-types";

const { Schema } = Mongoose;

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  scope: [{ type: String, required: true }],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserMongoose = Mongoose.model<NewUser & MongooseVersion>("User", userSchema);
