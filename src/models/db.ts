import { userMemStore } from "./mem/user-mem-store.js";
import { locationMemStore } from "./mem/location-mem-store.js";
import { photoMemStore } from "./mem/photo-mem-store.js";
import { Db } from "./store-types"

export const db: Db = {
  userStore: userMemStore,
  locationStore: locationMemStore,
  photoStore: photoMemStore,

  init(): void {
    this.userStore = userMemStore;
    this.locationStore = locationMemStore;
    this.photoStore = photoMemStore;
  },
};
