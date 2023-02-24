import { Location, LocationStore, NewLocation, NewLocationWithUserId } from "../store-types.js";
import { LocationMongoose } from "./location.js";
import { Types } from "mongoose"

function convertLeanLocationToLocation(location: Record<string, any>) {
  location._id = String(location._id)
  location.userId = String(location.userId)
  delete location.__v
  return location as Location
}

export const locationMongoStore: LocationStore = {
  async getAllLocations(): Promise<Location[]> {
    const leanLocations = await LocationMongoose.find().lean();
    const locations: Location[] = [];
    leanLocations.forEach(leanLocation => {
      locations.push(convertLeanLocationToLocation(leanLocation))
    });
    return locations;
  },

  async getLocationById(id: string): Promise<Location | null> {
    if (!Types.ObjectId.isValid(id)) {
      console.error(`Bad ID: "${id}"`);
      return null
    }
    const location = await LocationMongoose.findOne({ _id: id }).lean();
    if (location === null) {
      return null;
    }
    return convertLeanLocationToLocation(location);
  },

  async addLocation(location: NewLocationWithUserId): Promise<Location> {
    const newLocation = new LocationMongoose(location);
    const docLocation = await newLocation.save();
    const leanLocation = docLocation.toObject();
    return convertLeanLocationToLocation(leanLocation);
  },

  async getUserLocations(userId: string): Promise<Location[]> {
    if (!Types.ObjectId.isValid(userId)) {
      console.error(`Bad ID: "${userId}"`);
      return [];
    }
    const leanLocations = await LocationMongoose.find({ userId: userId }).lean();
    const locations: Location[] = [];
    leanLocations.forEach(leanLocation => {
      locations.push(convertLeanLocationToLocation(leanLocation))
    });
    return locations;
  },

  async deleteLocationById(id): Promise<void> {
    try {
      await LocationMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.error(`Bad ID: ${id}`);
    }
  },

  async deleteAllLocations(): Promise<void> {
    await LocationMongoose.deleteMany({});
  }
};
