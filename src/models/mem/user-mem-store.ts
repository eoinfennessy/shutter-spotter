import { v4 } from "uuid";
import { User, UserStore } from "../store-types";

let users: User[] = [];

export const userMemStore: UserStore = {
  async getAllUsers(): Promise<User[]> {
    return users;
  },

  async addUser(user: Omit<User, "_id">): Promise<User> {
    const userWithId: User = { ...user, _id: v4() }
    users.push(userWithId);
    return userWithId;
  },

  async getUserById(id: String): Promise<User | null> {
    const user = users.find((user) => user._id === id);
    return user ? user : null;
  },

  async getUserByEmail(email: String): Promise<User | null> {
    const user = users.find((user) => user.email === email);
    return user ? user : null;
  },

  async deleteUserById(id: String): Promise<void> {
    const index = users.findIndex((user) => user._id === id);
    if (index !== -1) users.splice(index, 1);
  },

  async deleteAll(): Promise<void> {
    users = [];
  },
};
