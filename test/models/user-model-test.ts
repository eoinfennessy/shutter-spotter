import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { suite, setup, test, teardown } from "mocha";
import { maggie, testUsers } from "../fixtures.js";
import { DbTypes, User } from "../../src/models/store-types.js";
import { assertSubset } from "../test-utils.js";
import { isDbType } from "../../src/utils/type-gaurds.js"
import dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

let dbType: DbTypes;
if (isDbType(process.env.DB_TYPE)) {
  dbType = process.env.DB_TYPE;
} else {
  throw new Error("'DB_TYPE' env variable has not been set or is not valid.");
}
const users: User[] = new Array(testUsers.length);

suite("User Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      users[i] = await db.userStore.addUser(testUsers[i])
    }
  });

  teardown(async () => {
    await db.userStore.deleteAll();
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("delete one user - success", async () => {
    await db.userStore.deleteUserById(users[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, users.length - 1);
    const deletedUser = await db.userStore.getUserById(users[0]._id);
    assert.isNull(deletedUser);
  });

  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById("1234"));
    // @ts-ignore
    assert.isNull(await db.userStore.getUserById());
  });

  test("get count of users", async () => {
    assert.equal(await db.userStore.count(), users.length);
    await db.userStore.deleteAll();
    assert.equal(await db.userStore.count(), 0);
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(users.length, allUsers.length);
  });
  
  test("update name", async () => {
    await db.userStore.updateName(users[0]._id, { firstName: "Jane", lastName: "Doe" });
    const updatedUser = await db.userStore.getUserById(users[0]._id);
    if (updatedUser === null) assert.fail("User is null")
    assert.equal(updatedUser.firstName, "Jane")
    assert.equal(updatedUser.lastName, "Doe")
  });
  
  test("update name - deleted user", async () => {
    await db.userStore.deleteUserById(users[0]._id);
    const user = await db.userStore.updateName(users[0]._id, { firstName: "Jane", lastName: "Doe" });
    assert.isNull(user)
  });

  test("update name - bad ID", async () => {
    const user = await db.userStore.updateName("1234", { firstName: "Jane", lastName: "Doe" });
    assert.isNull(user)
  });
  
  test("update email", async () => {
    await db.userStore.updateEmail(users[0]._id, "jane@doe.com");
    const updatedUser = await db.userStore.getUserById(users[0]._id);
    if (updatedUser === null) assert.fail("User is null")
    assert.equal(updatedUser.email, "jane@doe.com")
  });
  
  test("update email - deleted user", async () => {
    await db.userStore.deleteUserById(users[0]._id);
    const user = await db.userStore.updateEmail(users[0]._id, "jane@doe.com");
    assert.isNull(user)
  });

  test("update email - bad ID", async () => {
    const user = await db.userStore.updateEmail("1234", "jane@doe.com");
    assert.isNull(user)
  });
  
  test("update password", async () => {
    await db.userStore.updatePassword(users[0]._id, "newpassword");
    const updatedUser = await db.userStore.getUserById(users[0]._id);
    if (updatedUser === null) assert.fail("User is null")
    assert.equal(updatedUser.password, "newpassword")
  });
  
  test("update password - deleted user", async () => {
    await db.userStore.deleteUserById(users[0]._id);
    const user = await db.userStore.updatePassword(users[0]._id, "newpassword");
    assert.isNull(user)
  });

  test("update password - bad ID", async () => {
    const user = await db.userStore.updatePassword("1234", "newpassword");
    assert.isNull(user)
  });

  test("Add scope to user - success",async () => {
    await db.userStore.addScope(users[0]._id, "admin");
    const user = await db.userStore.getUserById(users[0]._id);
    if (user !== null) {
      assert.notEqual(user.scope.indexOf("admin"), -1);
    };
  });

  test("Add scope to user - scope already exists",async () => {
    const originalLength = users[0].scope.length;
    await db.userStore.addScope(users[0]._id, "user");
    const user = await db.userStore.getUserById(users[0]._id);
    if (user !== null) {
      assert.equal(user.scope.length, originalLength);
    };
  });
});
