import { v4 } from "uuid";
import { Location, LocationCategory, LocationStore, NewLocationWithUserId } from "../store-types.js";
import { firestore } from "../init-firebase.js";

const locationsRef = firestore.collection("locations");

export const locationFirebaseStore: LocationStore = {
  async getAllLocations(): Promise<Location[]> {
    const locationsSnapshot = await locationsRef.get();
    const locations: Location[] = [];
    locationsSnapshot.forEach((location) => {
      locations.push({
        _id: location.id,
        ...location.data(),
      } as Location);
    });
    return locations;
  },

  async addLocation(location: NewLocationWithUserId): Promise<Location> {
    const id = v4();
    await locationsRef.doc(id).set(location);
    const locationSnapshot = await locationsRef.doc(id).get();
    const newlocation = { _id: locationSnapshot.id, ...locationSnapshot.data() } as Location;
    return newlocation;
  },

  async getLocationById(id: string): Promise<Location | null> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!id) return null;
    const locationSnapshot = await locationsRef.doc(id).get();
    if (!locationSnapshot.exists) return null;
    const location = { _id: locationSnapshot.id, ...locationSnapshot.data() } as Location;
    return location;
  },

  async getUserLocations(userId: string): Promise<Location[]> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!userId) return [];
    const locations: Location[] = [];
    const locationSnapshots = await locationsRef.where("userId", "==", userId).get();
    locationSnapshots.forEach((location) => {
      locations.push({ _id: location.id, ...location.data() } as Location);
    });
    return locations;
  },

  async deleteLocationById(id: string): Promise<void> {
    await locationsRef.doc(id).delete();
  },

  async deleteAllLocations(): Promise<void> {
    // Firestore requires one doc to remain in a collection
    // and doesn't seem to allow recreation of a collection after all docs have been removed :(
    const locationSnapshots = await locationsRef.where("name", "!=", "placeholder").get();
    const locationDocs = locationSnapshots.docs;
    for (let i = 0; i < locationDocs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await locationDocs[i].ref.delete();
    }
  },

  async count(): Promise<number> {
    const countResult = await locationsRef.count().get();
    return countResult.data().count;
  },

  async countByCategory(): Promise<Partial<Record<LocationCategory, number>>> {
    const locationsSnapshot = await locationsRef.get();
    const counts: Partial<Record<LocationCategory, number>> = {};
    locationsSnapshot.forEach((location) => {
      const category = location.data().category as LocationCategory;
      const count = counts[category];
      if (count === undefined) {
        counts[category] = 1;
      } else {
        counts[category] = count + 1;
      }
    });
    return counts;
  },
};
