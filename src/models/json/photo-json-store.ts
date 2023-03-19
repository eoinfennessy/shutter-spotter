// @ts-nocheck
import { v4 } from "uuid";
import { Low } from "lowdb";
// @ts-ignore
import { JSONFile } from "lowdb/node";
import { BasePhoto, NewPhoto, Photo } from "../../types/schemas.js";
import { PhotoStore } from "../../types/store-specs.js";

interface LowPhoto extends Low {
  data: { photos: Photo[] };
}

const db = new Low(new JSONFile("./src/models/json/photos.json")) as LowPhoto;
db.data = { photos: [] };

export const photoJsonStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    await db.read();
    return db.data.photos;
  },

  async addPhoto(photo: NewPhoto): Promise<Photo> {
    await db.read();
    const photoWithId: Photo = { ...photo, _id: v4() };
    db.data.photos.push(photoWithId);
    await db.write();
    return photoWithId;
  },

  async getPhotosByLocationId(id: string): Promise<Photo[]> {
    await db.read();
    return db.data.photos.filter((photo) => photo.locationId === id);
  },

  async getPhotoById(id: string): Promise<Photo | null> {
    await db.read();
    const photo = db.data.photos.find((p) => p._id === id);
    return photo || null;
  },

  async deletePhoto(id: string): Promise<void> {
    await db.read();
    const index = db.data.photos.findIndex((photo) => photo._id === id);
    if (index !== -1) {
      db.data.photos.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllPhotos(): Promise<void> {
    db.data.photos = [];
    await db.write();
  },

  async updatePhoto(photoId: string, updates: Partial<BasePhoto>): Promise<Photo | null> {
    const photo = await this.getPhotoById(photoId);
    if (photo === null) {
      return null;
    }
    Object.keys(updates).forEach((key) => {
      const update = updates[key as keyof Partial<BasePhoto>];
      if (update !== undefined) {
        photo[key as keyof BasePhoto] = update;
      }
    });
    await db.write();
    return photo;
  },

  async count(): Promise<number> {
    await db.read();
    return db.data.photos.length;
  },
};
