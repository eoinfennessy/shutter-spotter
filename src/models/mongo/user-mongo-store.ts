import { Types } from "mongoose";
import { UserStore, User, NewUser, Name, Email, Password } from "../store-types.js";
import { UserMongoose } from "./user.js";

function convertLeanUserToUser(user: Record<string, any>) {
  user._id = String(user._id);
  delete user.__v;
  return user as User;
}

export const userMongoStore: UserStore = {
  async getAllUsers(): Promise<User[]> {
    const leanUsers = await UserMongoose.find().lean();
    const users: User[] = [];
    leanUsers.forEach((leanUser) => {
      users.push(convertLeanUserToUser(leanUser));
    });
    return users;
  },

  async getUserById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const leanUser = await UserMongoose.findOne({ _id: id }).lean();
    if (leanUser === null) {
      return null;
    }
    const user = convertLeanUserToUser(leanUser);
    return user;
  },

  async addUser(user: NewUser): Promise<User> {
    const id = new Types.ObjectId();
    const newUser = new UserMongoose({ ...user, _id: id, scope: ["user", `user-${id.toHexString()}`] });
    const docUser = await newUser.save();
    const leanUser = docUser.toObject();
    return convertLeanUserToUser(leanUser);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserMongoose.findOne({ email: email }).lean();
    if (user === null) {
      return null;
    }
    return convertLeanUserToUser(user);
  },

  async deleteUserById(id): Promise<void>  {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return;
    }
    await UserMongoose.deleteOne({ _id: id });
  },

  async deleteAll(): Promise<void> {
    await UserMongoose.deleteMany({});
  },

  async updateName(id: string, name: Name): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const user = await UserMongoose.findByIdAndUpdate(id, name, { new: true, lean: true });
    if (user === null) {
      return null;
    }
    return convertLeanUserToUser(user);
  },

  async updateEmail(id: string, email: Email): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const user = await UserMongoose.findByIdAndUpdate(id, { email: email }, { new: true, lean: true });
    if (user === null) {
      return null;
    }
    return convertLeanUserToUser(user);
  },

  async updatePassword(id: string, password: Password): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const user = await UserMongoose.findByIdAndUpdate(id, { password: password }, { new: true, lean: true });
    if (user === null) {
      return null;
    }
    return convertLeanUserToUser(user);
  },

  async addScope(id: string, scope: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return;
    }
    await UserMongoose.findByIdAndUpdate(id, { $addToSet: { scope: scope } });
  },
  
  async count(): Promise<number> {
    const count = await UserMongoose.countDocuments();
    return count;
  },
};
