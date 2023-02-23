import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers } from "../fixtures.js";
import { User } from "../../src/models/store-types.js";

suite("User API tests", () => {
  let users: User[] = [];

  setup(async () => {
    await shutterSpotterService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users.push(await shutterSpotterService.createUser(testUsers[i]));
    }
  });
  teardown(async () => {
    users = []
  });

  test("create a user", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await shutterSpotterService.deleteAllUsers();
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });
  
  test("delete one user - success", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await shutterSpotterService.deleteUser(users[0]._id);
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 2);
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
    assert.equal(returnedUsers.length, 3);
    await shutterSpotterService.deleteUser("123456");
    returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
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
    await shutterSpotterService.deleteAllUsers();
    try {
      const returnedUser = await shutterSpotterService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
