import { v4 } from "uuid";
import { bucket } from "../init-firebase.js";

bucket.makePublic();

export const firebaseImageStore = {
  getAllImages: async function () {
    const urls = [];
    const [files] = await bucket.getFiles();
    files.forEach((file) => {
      urls.push(file.publicUrl());
    });
  },

  uploadImage: async function (imagefile: string | NodeJS.ArrayBufferView) {
    const filename = v4();
    // @ts-ignore
    bucket.file(filename).save(imagefile);
    return bucket.file(filename).publicUrl();
  },

  deleteImage: async function (img: string) {
    const splitUrl = img.split("/");
    const filename = splitUrl[splitUrl.length - 1];
    bucket.file(filename).delete();
  },
};
