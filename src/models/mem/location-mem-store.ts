import { v4 } from "uuid";
import { Location, LocationCategory, NewLocationWithUserId } from "../../types/schemas.js";
import { LocationStore } from "../../types/store-specs.js";

let locations: Location[] = [];

export const locationMemStore: LocationStore = {
  async getAllLocations(): Promise<Location[]> {
    return locations;
  },

  async addLocation(location: NewLocationWithUserId): Promise<Location> {
    const locationWithId: Location = { ...location, _id: v4() };
    locations.push(locationWithId);
    return locationWithId;
  },

  async getLocationById(id: string): Promise<Location | null> {
    const location = locations.find((l) => l._id === id);
    return location || null;
  },

  async getUserLocations(userId: string): Promise<Location[]> {
    return locations.filter((location) => location.userId === userId);
  },

  async deleteLocationById(id: string): Promise<void> {
    const index = locations.findIndex((location) => location._id === id);
    if (index !== -1) locations.splice(index, 1);
  },

  async deleteAllLocations(): Promise<void> {
    locations = [];
  },

  async count(): Promise<number> {
    return locations.length;
  },

  async countByCategory(): Promise<Partial<Record<LocationCategory, number>>> {
    const counts: Partial<Record<LocationCategory, number>> = {};
    for (let i = 0; i < locations.length; i += 1) {
      const currentValue = counts[locations[i].category];
      if (currentValue === undefined) {
        counts[locations[i].category] = 1;
      } else {
        counts[locations[i].category] = currentValue + 1;
      }
    }
    return counts;
  },
};
