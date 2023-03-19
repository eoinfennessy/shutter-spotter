import { writeFileSync, rmSync, readdirSync } from "fs";
import { v4 } from "uuid";

export const localImageStore = {
  getAllImages: async function () {
    const images = readdirSync("./public/user/", { withFileTypes: true });
    return images.map((image) => `/user/${image}`);
  },

  uploadImage: async function (imagefile: string | NodeJS.ArrayBufferView) {
    const imageName = `${v4()}.img`;
    const imagePath = `./public/user/${imageName}`;
    writeFileSync(imagePath, imagefile);
    return `/user/${imageName}`;
  },

  deleteImage: async function (img: string) {
    rmSync(`./public${img}`);
  },
};
