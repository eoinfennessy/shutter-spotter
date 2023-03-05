import { exit } from "process";
import { cloudinaryImageStore } from "./cloudinary.js";

const storeType = process.env.IMAGE_STORE_TYPE;

let store;
switch (storeType) {
  case "local":
    console.error(`Unimplemented store type: ${storeType}`)
    exit(1);
    break;
  case "cloudinary":
    store = cloudinaryImageStore;
    break;
  case "firebase":
    console.error(`Unimplemented store type: ${storeType}`)
    exit(1);
    break;
  default:
    console.error(`Invalid image store type: ${storeType}`)
    exit(1);
}

export const imageStore = store;