import { assert } from "chai";
import { shutterSpotterService } from "./shutter-spotter-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers, testLocations, waterford, testPhotos, birdPhoto } from "../fixtures.js";
import { User, Location, Photo } from "../../src/models/store-types.js";

suite("Photo API tests", () => {
  shutterSpotterService.deleteAllPhotos();
  shutterSpotterService.deleteAllLocations();
  shutterSpotterService.deleteAllUsers();
  let locations: Location[] = [];
  let photos: Photo[] = [];

  setup(async () => {
    const user = await shutterSpotterService.createUser(maggie);
    for (let i = 0; i < testLocations.length; i++) {
      locations.push(await shutterSpotterService.createLocation({ ...testLocations[i], userId: user._id}))
      for (let j = 0; j < testPhotos.length; j++) {
        photos.push(await shutterSpotterService.createPhoto({ ...testPhotos[j], locationId: locations[i]._id}))
      }
    }
  });
  
  teardown(async () => {
    shutterSpotterService.deleteAllPhotos();
    shutterSpotterService.deleteAllLocations();
    shutterSpotterService.deleteAllUsers();
    locations = [];
    photos = [];
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
