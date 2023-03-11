import { PhotoMongoose } from "./photo.js";
import { BasePhoto, NewPhoto, Photo, PhotoStore } from "../store-types.js";
import { Types } from "mongoose"

function convertLeanPhotoToPhoto(photo: Record<string, any>) {
  photo._id = String(photo._id)
  photo.locationId = String(photo.locationId)
  photo.userId = String(photo.userId)
  // TODO: Convert comments and votes IDs
  delete photo.__v
  return photo as Photo
}

export const photoMongoStore: PhotoStore = {
  async getAllPhotos(): Promise<Photo[]> {
    const leanPhotos = await PhotoMongoose.find().lean();
    const photos: Photo[] = [];
    leanPhotos.forEach(leanPhoto => {
      photos.push(convertLeanPhotoToPhoto(leanPhoto))
    });
    return photos;
  },

  async addPhoto(photo: NewPhoto): Promise<Photo> {
    const newPhoto = new PhotoMongoose(photo);
    const docPhoto = await newPhoto.save();
    const objPhoto = docPhoto.toObject();
    return convertLeanPhotoToPhoto(objPhoto);
  },

  async getPhotosByLocationId(id: string): Promise<Photo[]> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return [];
    }
    const leanPhotos = await PhotoMongoose.find({ locationId: id }).lean();
    const photos: Photo[] = [];
    leanPhotos.forEach(leanPhoto => {
      photos.push(convertLeanPhotoToPhoto(leanPhoto))
    });
    return photos;
  },

  async getPhotoById(id: string): Promise<Photo | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null;
    }
    const photo = await PhotoMongoose.findOne({ _id: id }).lean();
    return photo === null ? null : convertLeanPhotoToPhoto(photo);
  },

  async deletePhoto(id: string): Promise<void> {
    try {
      await PhotoMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPhotos(): Promise<void> {
    await PhotoMongoose.deleteMany({});
  },

  async updatePhoto(photoId: string, updates: Partial<BasePhoto>): Promise<Photo | null> {
    return PhotoMongoose.findByIdAndUpdate(photoId, updates, { new: true, lean: true }, function (err, doc) {
      if (err) {
        console.log(err)
        return null
      }
      if (doc === null) {
        return null
      }
      return convertLeanPhotoToPhoto(doc)
    });
  },
};
