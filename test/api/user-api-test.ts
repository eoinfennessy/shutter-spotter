import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { suite, setup, test } from "mocha";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers } from "../fixtures.js";
import { User } from "../../src/models/store-types.js";

const users = new Array(testUsers.length)

suite("User API tests", () => {
  setup(async () => {
    await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
    await shutterSpotterService.deleteAllUsers();
    await shutterSpotterService.clearAuth();

    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await shutterSpotterService.createUser(testUsers[i]);
    }
    await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
  });

  test("create a user", async () => {
    const newUser = await shutterSpotterService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await shutterSpotterService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await shutterSpotterService.deleteAllUsers();
    await shutterSpotterService.createUser(maggie);
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
