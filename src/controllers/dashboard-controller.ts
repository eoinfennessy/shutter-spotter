import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { NewLocationSpec } from "../models/joi-schemas.js";
import { NewLocation, NewLocationWithUserId, User } from "../models/store-types.js";

const getDashboardData = async function (request: Request) {
  const loggedInUser = request.auth.credentials as User;
  const locations = await db.locationStore.getUserLocations(loggedInUser._id);
  return {
    user: loggedInUser,
    locations: locations,
  };
};

export const dashboardController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const viewData = await getDashboardData(request);
      return h.view("dashboard-view", { ...viewData, title: "ShutterSpotter Dashboard" });
    },
  },

  addLocation: {
    validate: {
      payload: NewLocationSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: async function (request: Request, h: ResponseToolkit, error: Record<string, any>): Promise<ResponseObject> {
        const viewData = await getDashboardData(request);
        return h
          .view("dashboard-view", {
            ...viewData,
            title: "Invalid Location",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const loggedInUser = request.auth.credentials;
      const payload = request.payload as NewLocation;
      const newLocation = {
        userId: loggedInUser._id,
        name: payload.name,
        description: payload.description,
        category: payload.category,
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
      } as NewLocationWithUserId;
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
