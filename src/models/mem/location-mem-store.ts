import { v4 } from "uuid";
import { Location, LocationStore, NewLocationWithUserId } from "../store-types.js";

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
};
