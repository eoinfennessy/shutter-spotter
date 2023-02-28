import { v4 } from "uuid";
import { NewUser, User, UserStore } from "../store-types.js";

let users: User[] = [];

export const userMemStore: UserStore = {
  async getAllUsers(): Promise<User[]> {
    return users;
  },

  async addUser(user: NewUser): Promise<User> {
    const id = v4();
    const userWithId: User = { ...user, _id: id, scope: ["user", `user-${id}`] };
    users.push(userWithId);
    return userWithId;
  },

  async getUserById(id: string): Promise<User | null> {
    const user = users.find((u) => u._id === id);
    return user || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const user = users.find((u) => u.email === email);
    return user || null;
  },

  async deleteUserById(id: string): Promise<void> {
    const index = users.findIndex((user) => user._id === id);
    if (index !== -1) users.splice(index, 1);
  },

  async deleteAll(): Promise<void> {
    users = [];
  },

  async addScope(id: string, scope: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user === null) return;
    if (user.scope.indexOf(scope) !== -1) return;
    user.scope.push(scope);
  }
};
