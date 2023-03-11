import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { suite, setup, test, teardown } from "mocha";
import { maggie, waterford, testPhotos, birdPhoto } from "../fixtures.js";
import { Photo } from "../../src/models/store-types.js";
import { assertSubset } from "../test-utils.js";
import { readFileSync } from "fs";
import { imageStore } from "../../src/models/file-storage/image-store.js";

let photos: Photo[] = new Array(testPhotos.length);
const imageFile = readFileSync("./test/test-image.png");

suite("Photo Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.locationStore.deleteAllLocations();
    await db.photoStore.deleteAllPhotos();

    const user = await db.userStore.addUser(maggie);
    const location = await db.locationStore.addLocation({ ...waterford, userId: user._id });
    for (let i = 0; i < testPhotos.length; i++) {
      const img = await imageStore.uploadImage(imageFile);
      photos.push(await db.photoStore.addPhoto({ ...testPhotos[i], locationId: location._id, userId: user._id, img: img }));
    }
  });

  teardown(async () => {
    await db.locationStore.deleteAllLocations();
    await db.photoStore.deleteAllPhotos();
    photos = [];
  });

  test("add a photo", async () => {
    const locations = await db.locationStore.getAllLocations();
    const img = await imageStore.uploadImage(imageFile);
    const newPhoto = await db.photoStore.addPhoto({ ...birdPhoto, locationId: locations[0]._id, userId: locations[0].userId, img: img });
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
    const img = await imageStore.uploadImage(imageFile);
    const newPhoto = await db.photoStore.addPhoto({ ...birdPhoto, locationId: locations[0]._id, userId: locations[0].userId, img: img });
    const returnedPhoto = await db.photoStore.getPhotoById(newPhoto._id);
    assert.deepEqual(newPhoto, returnedPhoto);
  });

  test("get photos by location ID - success", async () => {
    const locations = await db.locationStore.getAllLocations();
    const returnedPhotos = await db.photoStore.getPhotosByLocationId(locations[0]._id);
    assert.equal(photos.length, returnedPhotos.length);
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
    const photo = (await db.photoStore.getAllPhotos())[0];
    const updates = { title: "Greenway", description: "A Greenway photo" };
    db.photoStore.updatePhoto(photo._id, updates);
    const updatedPhoto = await db.photoStore.getPhotoById(photo._id);
    assert.isNotNull(updatedPhoto);
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
