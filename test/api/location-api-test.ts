import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers, testLocations, waterford } from "../fixtures.js";
import { User, Location } from "../../src/models/store-types.js";

suite("Location API tests", () => {
  shutterSpotterService.deleteAllLocations();
  shutterSpotterService.deleteAllUsers();
  let locations: Location[] = [];

  setup(async () => {
    const user = await shutterSpotterService.createUser(maggie);
    for (let i = 0; i < testLocations.length; i++) {
      locations.push(await shutterSpotterService.createLocation({ ...testLocations[i], userId: user._id}))
    }
  });
  
  teardown(async () => {
    shutterSpotterService.deleteAllLocations();
    shutterSpotterService.deleteAllUsers();
    locations = [];
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
