import { Types } from "mongoose";
import { UserStore, User, NewUser } from "../store-types.js";
import { UserMongoose } from "./user.js";

function convertLeanUserToUser(user: Record<string, any>) {
  user._id = String(user._id)
  delete user.__v
  return user as User
}

export const userMongoStore: UserStore = {
  async getAllUsers(): Promise<User[]> {
    const leanUsers = await UserMongoose.find().lean();
    const users: User[] = []
    leanUsers.forEach(leanUser => { users.push(convertLeanUserToUser(leanUser)) });
    return users;
  },

  async getUserById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const leanUser = await UserMongoose.findOne({ _id: id }).lean();
    if (leanUser === null) {
      return null
    }
    const user = convertLeanUserToUser(leanUser);
    return user;
  },

  async addUser(user: NewUser): Promise<User> {
    const newUser = new UserMongoose(user);
    const docUser = await newUser.save();
    const leanUser = docUser.toObject();
    return convertLeanUserToUser(leanUser);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserMongoose.findOne({ email: email }).lean();
    if (user === null) {
      return null
    }
    return convertLeanUserToUser(user);
  },

  async deleteUserById(id) {
    try {
      await UserMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.log(`Bad ID: "${id}"`);
    }
  },

  async deleteAll() {
    await UserMongoose.deleteMany({});
  }
};
