import { v4 } from "uuid";
import { Email, Name, NewGitHubUser, NewUser, Password, User } from "../../types/schemas.js";

let users: User[] = [];

export const userMemStore = {
  async getAllUsers(): Promise<User[]> {
    return users;
  },

  async addUser(user: NewUser | NewGitHubUser): Promise<User> {
    const _id = v4();
    const timeCreated = new Date().toISOString();
    const userWithId: User = { ...user, _id, timeCreated, scope: ["user", `user-${_id}`] };
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

  async updateName(id: string, name: Name): Promise<User | null> {
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.firstName = name.firstName;
    user.lastName = name.lastName;
    return user;
  },

  async updateEmail(id: string, email: Email): Promise<User | null> {
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.email = email;
    return user;
  },

  async updatePassword(id: string, password: Password): Promise<User | null> {
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.password = password;
    return user;
  },

  async addScope(id: string, scope: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user === null) return;
    if (user.scope.indexOf(scope) !== -1) return;
    user.scope.push(scope);
  },

  async count(): Promise<number> {
    return users.length;
  },
};
