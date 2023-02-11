import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { Location } from "../models/store-types.js";
import { isNewLocation } from "../utils/type-gaurds.js";

export const dashboardController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const loggedInUser = request.auth.credentials;
      if (typeof loggedInUser._id === 'string') {
        const locations = await db.locationStore.getUserLocations(loggedInUser._id);
        const viewData = {
          title: "ShutterSpotter Dashboard",
          user: loggedInUser,
          locations: locations,
        };
        return h.view("dashboard-view", viewData);
      } else {
        return h.redirect("/login")
      }
    },
  },

  addLocation: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const loggedInUser = request.auth.credentials;
      const payload = request.payload as Omit<Location, "_id" | "userId">
      const newLocation = {
        userId: loggedInUser._id,
        name: payload.name,
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
      } as Omit<Location, "_id">;
      await db.locationStore.addLocation(newLocation);
      return h.redirect("/dashboard");
    },
  },

  deleteLocation: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      if (location) {
        await db.locationStore.deleteLocationById(location._id);
      }
      return h.redirect("/dashboard");
    },
  },
};
