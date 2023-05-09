import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { db } from "../../src/models/db.js";
import { suite, setup, test, teardown } from "mocha";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers, superAdmin } from "../fixtures.js";
import { User } from "../../src/types/schemas.js";
import { DbTypes } from "../../src/types/store-specs.js";
import { isDbType } from "../../src/types/type-gaurds.js";
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
const users = new Array(testUsers.length);
let testSuperAdmin: User;

suite("User API tests", () => {
  setup(async () => {
    db.init(dbType);
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await db.userStore.addUser(testUsers[i]);
    }
    testSuperAdmin = await shutterSpotterService.createUser(superAdmin);
    await db.userStore.addScope(testSuperAdmin._id, "super-admin");
    await shutterSpotterService.authenticate(superAdmin);
  });

  teardown(async () => {
    await db.userStore.deleteAll();
  });

  test("create a user", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("update user's name", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    const updatedUser = await shutterSpotterService.updateUserName(newUser._id, { firstName: "Jane", lastName: "Doe" });
    assert.equal(updatedUser.firstName, "Jane");
    assert.equal(updatedUser.lastName, "Doe");
  });

  test("update user's name - bad ID", async () => {
    try {
      const updatedUser = await shutterSpotterService.updateUserName("1234", { firstName: "Jane", lastName: "Doe" });
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No user found matching the provided ID");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("update user's email", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    const updatedUser = await shutterSpotterService.updateEmail(newUser._id, { email: "new@email.com" });
    assert.equal(updatedUser.email, "new@email.com");
  });

  test("update user's email - bad ID", async () => {
    try {
      const updatedUser = await shutterSpotterService.updateEmail("1234", { email: "new@email.com" });
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No user found matching the provided ID");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("update user's password", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    const updatedUser = await shutterSpotterService.updatePassword(newUser._id, { password: "newpassword" });
    assert.equal(updatedUser.password, "newpassword");
  });

  test("update user's password - bad ID", async () => {
    try {
      const updatedUser = await shutterSpotterService.updatePassword("1234", { password: "newpassword" });
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No user found matching the provided ID");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete all users", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await shutterSpotterService.deleteAllUsers();
    const sa = await shutterSpotterService.createUser(maggie);
    await db.userStore.addScope(sa._id, "super-admin");
    await shutterSpotterService.authenticate(maggie);
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("delete one user - success", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await shutterSpotterService.deleteUser(users[0]._id);
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    try {
      const deletedUser = await shutterSpotterService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete one user - bad ID", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await shutterSpotterService.deleteUser("123456");
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
  });

  test("get a user - success", async () => {
    const returnedUser = await shutterSpotterService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await shutterSpotterService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    await shutterSpotterService.deleteUser(users[0]._id);
    try {
      const returnedUser = await shutterSpotterService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
