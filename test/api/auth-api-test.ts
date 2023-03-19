import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { suite, setup, test, teardown } from "mocha";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie } from "../fixtures.js";
import { db } from "../../src/models/db.js";
import { isDbType } from "../../src/utils/type-gaurds.js";
import dotenv from "dotenv";
import { DbTypes } from "../../src/models/store-types.js";

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

suite("Authentication API tests", async () => {
  setup(async () => {
    db.init(dbType);
    await db.userStore.deleteAll();
  });

  teardown(async () => {
    await db.userStore.deleteAll();
  });

  test("authenticate", async () => {
    const returnedUser = await shutterSpotterService.createUser(maggie);
    const response = await shutterSpotterService.authenticate({ email: maggie.email, password: maggie.password });
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await shutterSpotterService.createUser(maggie);
    const response = await shutterSpotterService.authenticate(maggie);
    const userInfo = decodeToken(response.token);
    if (userInfo === null) {
      assert.fail("userInfo is null");
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
      console.log(error);
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
