import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};

cloudinary.v2.config(credentials);

export const cloudinaryImageStore = {
  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile: string | NodeJS.ArrayBufferView) {
    writeFileSync("./public/temp.img", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/temp.img");
    return response.url;
  },

  deleteImage: async function(img: string) {
    await cloudinary.v2.uploader.destroy(img, {});
  }
};
