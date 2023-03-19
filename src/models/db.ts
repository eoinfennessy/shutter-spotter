import dotenv from "dotenv";

import { userMemStore } from "./mem/user-mem-store.js";
import { locationMemStore } from "./mem/location-mem-store.js";
import { photoMemStore } from "./mem/photo-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { locationJsonStore } from "./json/location-json-store.js";
import { photoJsonStore } from "./json/photo-json-store.js";

import { userMongoStore } from "./mongo/user-mongo-store.js";
import { locationMongoStore } from "./mongo/location-mongo-store.js";
import { photoMongoStore } from "./mongo/photo-mongo-store.js";
import { connectMongo } from "./mongo/connect-mongo.js";

import { userFirebaseStore } from "./firebase/user-firebase-store.js";
import { locationFirebaseStore } from "./firebase/location-firebase-store.js";
import { photoFirebaseStore } from "./firebase/photo-firebase-store.js";

import { createSuperAdminIfNotExists } from "./seed-db.js";
import { Db, DbTypes } from "../types/store-specs.js";

const result = dotenv.config();
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

export const db: Db = {
  userStore: userMemStore,
  locationStore: locationMemStore,
  photoStore: photoMemStore,

  init(dbType: DbTypes): void {
    switch (dbType) {
      case "mem":
        this.userStore = userMemStore;
        this.locationStore = locationMemStore;
        this.photoStore = photoMemStore;
        break;
      case "json":
        this.userStore = userJsonStore;
        this.locationStore = locationJsonStore;
        this.photoStore = photoJsonStore;
        break;
      case "mongo":
        this.userStore = userMongoStore;
        this.locationStore = locationMongoStore;
        this.photoStore = photoMongoStore;
        connectMongo();
        break;
      case "firebase":
        this.userStore = userFirebaseStore;
        this.locationStore = locationFirebaseStore;
        this.photoStore = photoFirebaseStore;
        break;
      default:
        throw new Error(`Invalid database type: ${dbType}`);
    }
  },

  seed(): void {
    if (process.env.SUPER_ADMIN_PASSWORD !== undefined) {
      createSuperAdminIfNotExists(this, process.env.SUPER_ADMIN_PASSWORD);
    }
  },
};
