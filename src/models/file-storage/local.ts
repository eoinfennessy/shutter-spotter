import { writeFileSync, rmSync, readdirSync } from "fs";
import { v4 } from "uuid";


export const localImageStore = {
  getAllImages: async function() {
    const images = readdirSync("./public/user/", { withFileTypes: true });
    return images.map(image => `./public/user/${image}`);
  },

  uploadImage: async function(imagefile: string | NodeJS.ArrayBufferView) {
    const imagePath = `./public/user/${v4()}.img`
    writeFileSync(imagePath, imagefile);
    return imagePath;
  },

  deleteImage: async function(img: string) {
    rmSync(img);
  }
};