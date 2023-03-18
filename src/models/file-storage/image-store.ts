import { exit } from "process";
import { localImageStore } from "./local.js";
import { cloudinaryImageStore } from "./cloudinary.js";
import { firebaseImageStore } from "./firebase.js";

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
    store = firebaseImageStore;
    break;
  default:
    console.error(`Invalid image store type: ${storeType}`)
    exit(1);
}

export const imageStore = store;