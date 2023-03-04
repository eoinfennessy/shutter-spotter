import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { suite, setup, test, teardown } from "mocha";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers, testLocations, waterford, testPhotos, birdPhoto, superAdmin } from "../fixtures.js";
import { User, Location, Photo } from "../../src/models/store-types.js";
import { db } from "../../src/models/db.js";

const locations: Location[] = new Array(testLocations.length);
const photos: Photo[] = new Array(testPhotos.length);
let testSuperAdmin: User;

suite("Photo API tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.photoStore.deleteAllPhotos();
    await db.locationStore.deleteAllLocations();
    await db.userStore.deleteAll();
    
    const photoOwner = await shutterSpotterService.createUser(maggie);
    await shutterSpotterService.authenticate(maggie);
    for (let i = 0; i < testLocations.length; i++) {
      locations[i] = await shutterSpotterService.createLocation({ ...testLocations[i], userId: photoOwner._id})
      for (let j = 0; j < testPhotos.length; j++) {
        photos[j] = await shutterSpotterService.createPhoto({ ...testPhotos[j], locationId: locations[i]._id})
      }
    }
    await shutterSpotterService.clearAuth();
    testSuperAdmin = await shutterSpotterService.createUser(superAdmin);
    await db.userStore.addScope(testSuperAdmin._id, "super-admin")
    await shutterSpotterService.authenticate(testSuperAdmin);
  });

  teardown(async () => {
    await db.photoStore.deleteAllPhotos();
    await db.locationStore.deleteAllLocations();
    await db.userStore.deleteAll();
  })

  test("get all photos", async () => {
    let returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
  });

  test("get photos by location ID", async () => {
    let returnedPhotos: Photo[] = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
    returnedPhotos = await shutterSpotterService.getLocationPhotos(photos[0].locationId);
    assert.equal(returnedPhotos.length, 3);
    returnedPhotos.forEach(photo => {
      assert.equal(photo.locationId, photos[0].locationId)
    });
  });

  test("create a photo", async () => {
    const newPhoto = { ...birdPhoto, locationId: locations[0]._id }
    const returnedphoto = await shutterSpotterService.createPhoto(newPhoto)
    assertSubset(newPhoto, returnedphoto);
    assert.isDefined(returnedphoto._id);
  });

  test("delete all photos", async () => {
    let returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
    await shutterSpotterService.deleteAllPhotos();
    returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 0);
  });
  
  test("delete one photo - success", async () => {
    let returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
    await shutterSpotterService.deletePhoto(photos[0]._id);
    returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 8);
    try {
      const deletedPhoto = await shutterSpotterService.getPhoto(photos[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Photo with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
  
  test("delete one photo - bad ID", async () => {
    let returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
    await shutterSpotterService.deletePhoto("1234");
    returnedPhotos = await shutterSpotterService.getAllPhotos();
    assert.equal(returnedPhotos.length, 9);
  });

  test("get a photo - success", async () => {
    const returnedPhoto = await shutterSpotterService.getPhoto(photos[0]._id);
    assert.deepEqual(photos[0], returnedPhoto);
  });

  test("get a photo - bad id", async () => {
    try {
      const returnedPhoto = await shutterSpotterService.getPhoto("1234");
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Photo with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a photo - deleted photo", async () => {
    await shutterSpotterService.deleteAllPhotos();
    try {
      const returnedPhoto = await shutterSpotterService.getPhoto(photos[0]._id);
      assert.fail("Should not return a response");
    } catch (error: any) {
      assert(error.response.data.message === "No Photo with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
