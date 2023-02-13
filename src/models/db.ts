import { userMemStore } from "./mem/user-mem-store.js";
import { locationMemStore } from "./mem/location-mem-store.js";
import { photoMemStore } from "./mem/photo-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { locationJsonStore } from "./json/location-json-store.js";
import { photoJsonStore } from "./json/photo-json-store.js";

import { Db } from "./store-types"

export const db: Db = {
  userStore: userMemStore,
  locationStore: locationMemStore,
  photoStore: photoMemStore,

  init(dbType: "mem" | "json"): void {
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
      default:
        throw new Error(`Invalid database type: ${dbType}`);
    }
  },
};
