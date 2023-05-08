import { v4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../init-firebase.js";
import { Email, Name, NewUser, Password, User } from "../../types/schemas.js";

const usersRef = firestore.collection("accounts");

export const userFirebaseStore = {
  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await usersRef.get();
    const users: User[] = [];
    usersSnapshot.forEach((user) => {
      users.push({
        _id: user.id,
        ...user.data(),
      } as User);
    });
    return users;
  },

  async addUser(user: NewUser): Promise<User> {
    const id = v4();
    const userWithScope = { ...user, scope: ["user", `user-${id}`] };
    await usersRef.doc(id).set(userWithScope);
    const userSnapshot = await usersRef.doc(id).get();
    const newUser = { _id: userSnapshot.id, ...userSnapshot.data() } as User;
    return newUser;
  },

  async getUserById(id: string): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) return null;
    const userSnapshot = await usersRef.doc(id).get();
    if (!userSnapshot.exists) return null;
    const user = { _id: userSnapshot.id, ...userSnapshot.data() } as User;
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!email) return null;
    const userSnapshots = await usersRef.where("email", "==", email).get();
    if (userSnapshots.empty) return null;
    const userDoc = userSnapshots.docs[0];
    return { _id: userDoc.id, ...userDoc.data() } as User;
  },

  async deleteUserById(id: string): Promise<void> {
    await usersRef.doc(id).delete();
  },

  async deleteAll(): Promise<void> {
    // Firestore requires one doc to remain in a collection
    // and doesn't seem to allow recreation of a collection after all docs have been removed :(
    const userSnapshots = await usersRef.where("email", "!=", "john@doe.com").get();
    const userDocs = userSnapshots.docs;
    for (let i = 0; i < userDocs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await userDocs[i].ref.delete();
    }
  },

  async updateName(id: string, name: Name): Promise<User | null> {
    if ((await this.getUserById(id)) === null) return null;
    await usersRef.doc(id).update(name);
    return this.getUserById(id);
  },

  async updateEmail(id: string, email: Email): Promise<User | null> {
    if ((await this.getUserById(id)) === null) return null;
    await usersRef.doc(id).update({ email: email });
    return this.getUserById(id);
  },

  async updatePassword(id: string, password: Password): Promise<User | null> {
    if ((await this.getUserById(id)) === null) return null;
    await usersRef.doc(id).update({ password: password });
    return this.getUserById(id);
  },

  async addScope(id: string, scope: string): Promise<void> {
    if ((await this.getUserById(id)) === null) return;
    await usersRef.doc(id).update({
      scope: FieldValue.arrayUnion(scope),
    });
  },

  async count(): Promise<number> {
    const countResult = await usersRef.count().get();
    return countResult.data().count;
  },
};
