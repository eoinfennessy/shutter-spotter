import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { suite, setup, test, teardown } from "mocha";
import { maggie, waterford, testPhotos, birdPhoto } from "../fixtures.js";
import { Photo } from "../../src/models/store-types.js";
import { assertSubset } from "../test-utils.js";

suite("Photo Model tests", () => {
  db.locationStore.deleteAllLocations();
  db.photoStore.deleteAllPhotos();
  let photos: Photo[] = [];

  setup(async () => {
    db.init("json");
    const user = await db.userStore.addUser(maggie);
    const location = await db.locationStore.addLocation({ ...waterford, userId: user._id });
    for (let i = 0; i < testPhotos.length; i++) {
      photos.push(await db.photoStore.addPhoto(location._id, testPhotos[i]));
    }
  });

  teardown(async () => {
    await db.locationStore.deleteAllLocations();
    await db.photoStore.deleteAllPhotos();
    photos = [];
  });

  test("add a photo", async () => {
    const locations = await db.locationStore.getAllLocations();
    const newPhoto = await db.photoStore.addPhoto(locations[0]._id, birdPhoto);
    assertSubset(birdPhoto, newPhoto);
  });

  test("delete all photos", async () => {
    const photos = await db.photoStore.getAllPhotos();
    assert.isNotEmpty(photos);
    await db.photoStore.deleteAllPhotos();
    const photosAfterDelete = await db.photoStore.getAllPhotos();
    assert.isEmpty(photosAfterDelete);
  });

  test("get a photo - success", async () => {
    const locations = await db.locationStore.getAllLocations();
    const newPhoto = await db.photoStore.addPhoto(locations[0]._id, birdPhoto);
    const returnedPhoto = await db.photoStore.getPhotoById(newPhoto._id);
    assert.deepEqual(newPhoto, returnedPhoto);
  });

  test("get photos by location ID - success", async () => {
    const locations = await db.locationStore.getAllLocations();
    const returnedPhotos = await db.photoStore.getPhotosByLocationId(locations[0]._id);
    assert.equal(photos.length, returnedPhotos.length)
    for (const photo of returnedPhotos) {
      assert.propertyVal(photo, "locationId", locations[0]._id);
    }
  });

  test("delete one photo - success", async () => {
    await db.photoStore.deletePhoto(photos[0]._id);
    const returnedPhotos = await db.photoStore.getAllPhotos();
    assert.equal(returnedPhotos.length, photos.length - 1);
    const deletedPhoto = await db.photoStore.getPhotoById(photos[0]._id);
    assert.isNull(deletedPhoto);
  });

  test("update photo - success", async () => {
    const photo = (await db.photoStore.getAllPhotos())[0]
    const updates = { name: "Greenway", description: "A Greenway photo" }
    db.photoStore.updatePhoto(photo, updates)
    const updatedPhoto = await db.photoStore.getPhotoById(photo._id);
    assert.isNotNull(updatedPhoto)
    assertSubset(updates, updatedPhoto);
  });

  test("get a photo - bad params", async () => {
    assert.isNull(await db.photoStore.getPhotoById(""));
    assert.isNull(await db.photoStore.getPhotoById("not an ID"));
    // @ts-ignore
    assert.isNull(await db.photoStore.getPhotoById());
  });

  test("get photos by location ID - bad params", async () => {
    assert.isEmpty(await db.photoStore.getPhotosByLocationId(""));
    assert.isEmpty(await db.photoStore.getPhotosByLocationId("not an ID"));
    // @ts-ignore
    assert.isEmpty(await db.photoStore.getPhotosByLocationId());
  });

  test("delete one photo - bad params", async () => {
    await db.photoStore.deletePhoto("not an ID");
    const allPhotos = await db.photoStore.getAllPhotos();
    assert.equal(photos.length, allPhotos.length);
  });
});
