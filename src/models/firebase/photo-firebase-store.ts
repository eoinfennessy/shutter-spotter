import { v4 } from "uuid";
import { firestore } from "../init-firebase.js";
import { BasePhoto, NewPhoto, Photo, PhotoStore } from "../store-types.js";

const photosRef = firestore.collection("photos");

export const photoFirebaseStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    const photosSnapshot = await photosRef.get();
    const photos: Photo[] = [];
    photosSnapshot.forEach((photo) => {
      photos.push({
        _id: photo.id,
        ...photo.data(),
      } as Photo);
    });
    return photos;
  },

  async addPhoto(photo: NewPhoto): Promise<Photo> {
    const id = v4();
    await photosRef.doc(id).set(photo);
    const photoSnapshot = await photosRef.doc(id).get();
    const newPhoto = { _id: photoSnapshot.id, ...photoSnapshot.data() } as Photo;
    return newPhoto;
  },

  async getPhotosByLocationId(id: string): Promise<Photo[]> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) return [];
    const photos: Photo[] = [];
    const photoSnapshots = await photosRef.where("locationId", "==", id).get();
    photoSnapshots.forEach((photo) => {
      photos.push({ _id: photo.id, ...photo.data() } as Photo);
    });
    return photos;
  },

  async getPhotoById(id: string): Promise<Photo | null> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) return null;
    const photoSnapshot = await photosRef.doc(id).get();
    if (!photoSnapshot.exists) return null;
    const photo = { _id: photoSnapshot.id, ...photoSnapshot.data() } as Photo;
    return photo;
  },

  async deletePhoto(id: string): Promise<void> {
    await photosRef.doc(id).delete();
  },

  async deleteAllPhotos(): Promise<void> {
    // Firestore requires one doc to remain in a collection
    // and doesn't seem to allow recreation of a collection after all docs have been removed :(
    const photoSnapshots = await photosRef.where("title", "!=", "placeholder").get();
    const photoDocs = photoSnapshots.docs;
    for (let i = 0; i < photoDocs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await photoDocs[i].ref.delete();
    }
  },

  async updatePhoto(photoId: string, updates: Partial<BasePhoto>): Promise<Photo | null> {
    if ((await this.getPhotoById(photoId)) === null) return null;
    await photosRef.doc(photoId).update(updates);
    return this.getPhotoById(photoId);
  },

  async count(): Promise<number> {
    const countResult = await photosRef.count().get();
    return countResult.data().count;
  },
};
