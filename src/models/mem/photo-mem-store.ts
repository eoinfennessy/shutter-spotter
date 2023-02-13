import { v4 } from "uuid";
import { Photo, PhotoStore } from "../store-types.js";

let photos: Photo[] = [];

export const photoMemStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    return photos;
  },

  async addPhoto(locationId: string, photo: Omit<Photo, "_id" | "locationId">): Promise<Photo> {
    const photoWithIds: Photo = { ...photo, _id: v4(), locationId: locationId };
    photos.push(photoWithIds);
    return photoWithIds;
  },

  async getPhotosByLocationId(id: string): Promise<Photo[]> {
    return photos.filter((photo) => photo.locationId === id);
  },

  async getPhotoById(id: string): Promise<Photo | null> {
    const photo = photos.find((p) => p._id === id);
    return photo || null;
  },

  async deletePhoto(id: string): Promise<void> {
    const index = photos.findIndex((photo) => photo._id === id);
    if (index !== -1) photos.splice(index, 1);
  },

  async deleteAllPhotos(): Promise<void> {
    photos = [];
  },

  async updatePhoto(photo: Photo, updatedPhoto: Omit<Photo, "_id" | "locationId">): Promise<void> {
    Object.keys(updatedPhoto).forEach(key => {
      photo[key as keyof Photo] = updatedPhoto[key as keyof Omit<Photo, "_id" | "locationId">];
    });
  },
};