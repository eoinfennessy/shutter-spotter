import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { suite, setup, test, teardown } from "mocha";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    shutterSpotterService.clearAuth();
    await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
    await shutterSpotterService.deleteAllUsers();
  });

  test("authenticate", async () => {
    const returnedUser = await shutterSpotterService.createUser(maggie);
    console.log(returnedUser)
    const response = await shutterSpotterService.authenticate({ email: maggie.email, password: maggie.password });
    console.log(response)
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await shutterSpotterService.createUser(maggie);
    const response = await shutterSpotterService.authenticate(maggie);
    const userInfo = decodeToken(response.token);
    if (userInfo === null) {
      assert.fail("userInfo is null")
    } else {
      assert.equal(userInfo.email, returnedUser.email);
      assert.equal(userInfo.id, returnedUser._id);
      assert.deepEqual(userInfo.scope, returnedUser.scope);
    }
  });

  test("check Unauthorized", async () => {
    shutterSpotterService.clearAuth();
    try {
      await shutterSpotterService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error: any) {
      console.log(error)
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
