import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { suite, setup, test, teardown } from "mocha";
import { maggie, testLocations, waterford } from "../fixtures.js";
import { DbTypes, Location } from "../../src/models/store-types.js";
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
let locations: Location[] = new Array(testLocations.length);

suite("Location Model tests", () => {
  setup(async () => {
    db.init(dbType)
    await db.locationStore.deleteAllLocations();

    const user = await db.userStore.addUser(maggie);
    for (let i = 0; i < testLocations.length; i += 1) {
      const location = { ...testLocations[i], userId: user._id};
      locations[i] = await db.locationStore.addLocation(location);
    }
  });

  teardown(async () => {
    await db.locationStore.deleteAllLocations();
  });

  test("create a location", async () => {
    const user = await db.userStore.addUser(maggie);
    const location = { ...waterford, userId: user._id }
    const newLocation = await db.locationStore.addLocation(location);
    assertSubset(location, newLocation);
  });

  test("delete all locations", async () => {
    const locations = await db.locationStore.getAllLocations();
    assert.isNotEmpty(locations);
    await db.locationStore.deleteAllLocations();
    const locationsAfterDelete = await db.locationStore.getAllLocations();
    assert.isEmpty(locationsAfterDelete);
  });

  test("get a location - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const location = { ...waterford, userId: user._id }
    const newLocation = await db.locationStore.addLocation(location);
    const returnedLocation = await db.locationStore.getLocationById(newLocation._id);
    assert.deepEqual(newLocation, returnedLocation);
  });

  test("get user locations - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const locations: Location[] = [];
    for (let i = 0; i < testLocations.length; i += 1) {
      const location = { ...testLocations[i], userId: user._id};
      locations.push(await db.locationStore.addLocation(location));
    }
    const returnedLocations = await db.locationStore.getUserLocations(user._id);
    assert.equal(locations.length, returnedLocations.length)
    for (const returnedLocation of returnedLocations) {
      assert.propertyVal(returnedLocation, "userId", user._id);
    }
  });

  test("delete one location - success", async () => {
    await db.locationStore.deleteLocationById(locations[0]._id);
    const returnedLocations = await db.locationStore.getAllLocations();
    assert.equal(returnedLocations.length, locations.length - 1);
    const deletedLocation = await db.locationStore.getLocationById(locations[0]._id);
    assert.isNull(deletedLocation);
  });

  test("get a location - bad params", async () => {
    assert.isNull(await db.locationStore.getLocationById(""));
    assert.isNull(await db.locationStore.getLocationById("not an ID"));
    // @ts-ignore
    assert.isNull(await db.locationStore.getLocationById());
  });

  test("get user locations - bad params", async () => {
    assert.isEmpty(await db.locationStore.getUserLocations(""));
    assert.isEmpty(await db.locationStore.getUserLocations("not an ID"));
    // @ts-ignore
    assert.isEmpty(await db.locationStore.getUserLocations());
  });

  test("delete one location - bad params", async () => {
    await db.locationStore.deleteLocationById("not an ID");
    const allLocations = await db.locationStore.getAllLocations();
    assert.equal(locations.length, allLocations.length);
  });

  test("get count of locations", async () => {
    assert.equal(await db.locationStore.count(), locations.length);
    await db.locationStore.deleteAllLocations();
    assert.equal(await db.locationStore.count(), 0);
  });
  
  test("get count of locations by category", async () => {
    let counts = await db.locationStore.countByCategory();
    assert.equal(counts["Nature"], 1);
    assert.equal(counts["Landscape"], 2);
    await db.locationStore.deleteAllLocations();
    counts = await db.locationStore.countByCategory();
    assert.deepEqual(counts, {})
  });
});
