import Boom from "@hapi/boom";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { IdSpec, LocationArray, LocationSpec, NewLocationWithUserIdSpec } from "../models/joi-schemas.js";
import { NewLocationWithUserId } from "../models/store-types.js";
import { validationError } from "./logger.js";

export const locationApi = {
  create: {
    auth: {
      strategy: "jwt",
      scope: ["user-{payload.userId}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locationPayload = request.payload as NewLocationWithUserId;
        const location = await db.locationStore.addLocation(locationPayload);
        return h.response(location).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a location",
    notes: "Returns the newly created location",
    validate: { payload: NewLocationWithUserIdSpec, options: { stripUnknown: true }, failAction: validationError },
    response: { schema: LocationSpec, failAction: validationError },
  },

  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locations = await db.locationStore.getAllLocations();
        return h.response(locations).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all locations",
    notes: "Returns details of all locations",
    response: { schema: LocationArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const location = await db.locationStore.getLocationById(request.params.id);
        if (!location) {
          return Boom.notFound("No Location with this id");
        }
        return h.response(location).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get a specific location",
    notes: "Returns details of location matching specified ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: LocationSpec, failAction: validationError },
  },

  findUserLocations: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locations = await db.locationStore.getUserLocations(request.params.id);
        return h.response(locations).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get a user's locations",
    notes: "Returns details of all locations matching specified user ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: LocationArray, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
      scope: "super-admin",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.locationStore.deleteAllLocations();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes all locations",
    notes: "Deletes all locations from ShutterSpotter's DB",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.userId}", "admin", "super-admin"]
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const location = await db.locationStore.getLocationById(request.params.locationId);
        if (location === null) return Boom.notFound("No Location with this id");
        if (location.userId !== request.params.userId) return Boom.forbidden();
        await db.locationStore.deleteLocationById(request.params.locationId);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes a specific location",
    notes: "Deletes location matching specified ID from the ShutterSpotter DB",
    validate: { params: { userId: IdSpec, locationId: IdSpec }, failAction: validationError },
  },
};
