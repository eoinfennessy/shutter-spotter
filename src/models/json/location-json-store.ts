import { v4 } from "uuid";
import { Low } from "lowdb";
// @ts-ignore
import { JSONFile } from "lowdb/node";
import { Location, LocationCategory, LocationStore, NewLocationWithUserId } from "../store-types.js";

interface LowLocation extends Low {
  data: { locations: Location[] };
}

const db = new Low(new JSONFile("./src/models/json/locations.json")) as LowLocation;
db.data = { locations: [] };

export const locationJsonStore: LocationStore = {
  async getAllLocations(): Promise<Location[]> {
    await db.read();
    return db.data.locations;
  },

  async addLocation(location: NewLocationWithUserId): Promise<Location> {
    await db.read();
    const locationWithId: Location = { ...location, _id: v4() };
    db.data.locations.push(locationWithId);
    await db.write();
    return locationWithId;
  },

  async getLocationById(id: string): Promise<Location | null> {
    await db.read();
    const location = db.data.locations.find((l) => l._id === id);
    return location || null;
  },

  async getUserLocations(userId: string): Promise<Location[]> {
    await db.read();
    return db.data.locations.filter((location) => location.userId === userId);
  },

  async deleteLocationById(id: string): Promise<void> {
    await db.read();
    const index = db.data.locations.findIndex((location) => location._id === id);
    if (index !== -1) {
      db.data.locations.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllLocations(): Promise<void> {
    db.data.locations = [];
    await db.write();
  },

  async count(): Promise<number> {
    await db.read();
    return db.data.locations.length;
  },

  async countByCategory(): Promise<Partial<Record<LocationCategory, number>>> {
    await db.read();
    const counts: Partial<Record<LocationCategory, number>> = {};
    for (let i = 0; i < db.data.locations.length; i += 1) {
      const currentValue = counts[db.data.locations[i].category];
      if (currentValue === undefined) {
        counts[db.data.locations[i].category] = 1;
      } else {
        counts[db.data.locations[i].category] = currentValue + 1;
      }
    }
    return counts;
  },
};
