// // @ts-nocheck
import Boom from "@hapi/boom";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { db } from "../models/db.js";
import {} from "../models/joi-schemas.js";
import {} from "../types/schemas.js";
import { validationError } from "./logger.js";

export const analyticsApi = {
  getUserCount: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const userCount = await db.userStore.count();
        return h.response({ userCount }).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Gets count of users",
    notes: "Gets count of all users",
    response: { schema: Joi.object().keys({ userCount: Joi.number() }), failAction: validationError },
  },

  getLocationCount: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locationCount = await db.locationStore.count();
        return h.response({ locationCount }).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Gets count of locations",
    notes: "Gets count of all locations for all users",
    response: { schema: Joi.object().keys({ locationCount: Joi.number() }), failAction: validationError },
  },

  getPhotoCount: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photoCount = await db.photoStore.count();
        return h.response({ photoCount }).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Gets count of photos",
    notes: "Gets count of all photos for all users",
    response: { schema: Joi.object().keys({ photoCount: Joi.number() }), failAction: validationError },
  },

  getLocationCountByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locationCountByCategory = await db.locationStore.countByCategory();
        return h.response({ locationCountByCategory }).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Gets count of locations by category",
    notes: "Gets count of all locations grouped by location category",
    response: {
      schema: Joi.object().keys({
        locationCountByCategory: Joi.object().keys({
          Landscape: Joi.number(),
          Nature: Joi.number(),
          Wildlife: Joi.number(),
          Architecture: Joi.number(),
          Macro: Joi.number(),
          Aerial: Joi.number(),
          Street: Joi.number(),
        }),
      }),
      failAction: validationError,
    },
  },

  getAllUserCreationTimes: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const times = await db.userStore.getAllUserCreationTimes();
        return h.response(times).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Gets all user creation times",
    notes: "Gets creation times for all users",
    response: { schema: Joi.array().items(Joi.string()), failAction: validationError },
  },
  // getLocationCreationDates:
  // getPhotoCreationDates:
};
