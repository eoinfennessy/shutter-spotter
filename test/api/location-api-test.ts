import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { suite, setup, test } from "mocha";
import { assertSubset } from "../test-utils.js";
import { maggie, testLocations, waterford } from "../fixtures.js";
import { Location } from "../../src/models/store-types.js";

const locations = new Array(testLocations.length)

suite("Location API tests", () => {
  setup(async () => {
    await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
    await shutterSpotterService.deleteAllLocations();
    await shutterSpotterService.deleteAllUsers();

    const user = await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
    for (let i = 0; i < testLocations.length; i++) {
      locations[i] = await shutterSpotterService.createLocation({ ...testLocations[i], userId: user._id})
    }
  });

  test("get all locations", async () => {
    let returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 3);
  });

  test("get user locations", async () => {
    const dummyUser = await shutterSpotterService.createUser(maggie);
    const newLocation = { ...waterford, userId: dummyUser._id }
    await shutterSpotterService.createLocation({ ...newLocation, userId: dummyUser._id})

    let returnedLocations: Location[] = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 4);
    returnedLocations = await shutterSpotterService.getUserLocations(locations[0].userId);
    assert.equal(returnedLocations.length, 3);
    returnedLocations.forEach(location => {
      assert.equal(location.userId, locations[0].userId)
    });
  });

  test("create a location", async () => {
    const user = await shutterSpotterService.createUser(maggie);
    const newLocation = { ...waterford, userId: user._id }
    const returnedLocation = await shutterSpotterService.createLocation({ ...newLocation, userId: user._id})
    assertSubset(newLocation, returnedLocation);
    assert.isDefined(returnedLocation._id);
  });

  test("delete all locations", async () => {
    let returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 3);
    await shutterSpotterService.deleteAllLocations();
    returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 0);
  });
  
  test("delete one location - success", async () => {
    let returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 3);
    await shutterSpotterService.deleteLocation(locations[0]._id);
    returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 2);
    try {
      const deletedLocation = await shutterSpotterService.getLocation(locations[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Location with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
  
  test("delete one location - bad ID", async () => {
    let returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 3);
    await shutterSpotterService.deleteLocation("123456");
    returnedLocations = await shutterSpotterService.getAllLocations();
    assert.equal(returnedLocations.length, 3);
  });

  test("get a location - success", async () => {
    const returnedLocation = await shutterSpotterService.getLocation(locations[0]._id);
    assert.deepEqual(locations[0], returnedLocation);
  });

  test("get a location - bad id", async () => {
    try {
      const returnedLocartion = await shutterSpotterService.getLocation("1234");
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Location with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a location - deleted location", async () => {
    await shutterSpotterService.deleteAllLocations();
    try {
      const returnedLocation = await shutterSpotterService.getLocation(locations[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Location with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
