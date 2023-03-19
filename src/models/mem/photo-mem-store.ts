import { v4 } from "uuid";
import { BasePhoto, NewPhoto, Photo } from "../../types/schemas.js";
import { PhotoStore } from "../../types/store-specs.js";

let photos: Photo[] = [];

export const photoMemStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    return photos;
  },

  async addPhoto(photo: NewPhoto): Promise<Photo> {
    const photoWithId: Photo = { ...photo, _id: v4() };
    photos.push(photoWithId);
    return photoWithId;
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

  async updatePhoto(photoId: string, updates: Partial<BasePhoto>): Promise<Photo | null> {
    const photo = await this.getPhotoById(photoId);
    if (photo === null) {
      return null;
    }
    const keys = Object.keys(updates);
    keys.forEach((key) => {
      const update = updates[key as keyof Partial<BasePhoto>];
      if (update !== undefined) {
        photo[key as keyof BasePhoto] = update;
      }
    });
    return photo;
  },

  async count(): Promise<number> {
    return photos.length;
  },
};
