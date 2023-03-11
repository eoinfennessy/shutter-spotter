import { exit } from "process";
import { cloudinaryImageStore } from "./cloudinary.js";
import { localImageStore } from "./local.js";

const storeType = process.env.IMAGE_STORE_TYPE;

let store;
switch (storeType) {
  case "local":
    store = localImageStore
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