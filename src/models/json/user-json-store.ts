// @ts-nocheck
import { v4 } from "uuid";
import { Low } from "lowdb";
// @ts-ignore
import { JSONFile } from "lowdb/node";
import { Email, Name, NewUser, Password, User } from "../../types/schemas";

interface LowUser extends Low {
  data: { users: User[] };
}

const db = new Low(new JSONFile("./src/models/json/users.json")) as LowUser;
db.data = { users: [] };

export const userJsonStore = {
  async getAllUsers(): Promise<User[]> {
    await db.read();
    return db.data.users;
  },

  async addUser(user: NewUser): Promise<User> {
    await db.read();
    const id = v4();
    const userWithId: User = { ...user, _id: id, scope: ["user", `user-${id}`] };
    db.data.users.push(userWithId);
    await db.write();
    return userWithId;
  },

  async getUserById(id: string): Promise<User | null> {
    await db.read();
    const user = db.data.users.find((u) => u._id === id);
    return user || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await db.read();
    const user = db.data.users.find((u) => u.email === email);
    return user || null;
  },

  async deleteUserById(id: string): Promise<void> {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) {
      db.data.users.splice(index, 1);
      await db.write();
    }
  },

  async deleteAll(): Promise<void> {
    db.data.users = [];
    await db.write();
  },

  async updateName(id: string, name: Name): Promise<User | null> {
    await db.read();
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.firstName = name.firstName;
    user.lastName = name.lastName;
    await db.write();
    return user;
  },

  async updateEmail(id: string, email: Email): Promise<User | null> {
    await db.read();
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.email = email;
    await db.write();
    return user;
  },

  async updatePassword(id: string, password: Password): Promise<User | null> {
    await db.read();
    const user = await this.getUserById(id);
    if (user === null) {
      return null;
    }
    user.password = password;
    await db.write();
    return user;
  },

  async addScope(id: string, scope: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user === null) return;
    if (user.scope.indexOf(scope) !== -1) return;
    user.scope.push(scope);
    await db.write();
  },

  async count(): Promise<number> {
    await db.read();
    return db.data.users.length;
  },
};
