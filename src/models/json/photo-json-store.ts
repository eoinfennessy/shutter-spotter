import { v4 } from "uuid";
import { Low } from "lowdb";
// @ts-ignore
import { JSONFile } from "lowdb/node";
import { Photo, PhotoStore } from "../store-types.js";

interface LowPhoto extends Low {
  data: { photos: Photo[] };
}

const db = new Low(new JSONFile("./src/models/json/locations.json")) as LowPhoto;
db.data = { photos: [] };

export const photoJsonStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    await db.read();
    return db.data.photos;
  },

  async addPhoto(locationId: string, photo: Omit<Photo, "_id" | "locationId">): Promise<Photo> {
    await db.read();
    const photoWithIds: Photo = { ...photo, _id: v4(), locationId: locationId };
    db.data.photos.push(photoWithIds);
    await db.write();
    return photoWithIds;
  },

  async getPhotosByLocationId(id: string): Promise<Photo[]> {
    await db.read();
    return db.data.photos.filter((photo) => photo.locationId === id);
  },

  async getPhotoById(id: string): Promise<Photo | null> {
    await db.read();
    const photo = db.data.photos.find((p) => p._id === id);
    return photo || null
  },

  async deletePhoto(id: string): Promise<void>  {
    await db.read();
    const index = db.data.photos.findIndex((photo) => photo._id === id);
    if (index !== -1) {
      db.data.photos.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllPhotos(): Promise<void> {
    db.data.photos = [];
    db.write();
  },

  async updatePhoto(photo: Photo, updatedPhoto: Omit<Photo, "_id" | "locationId">): Promise<void> {
    photo.name = updatedPhoto.name;
    photo.description = updatedPhoto.description;
    await db.write();
  },
};
