import Boom from "@hapi/boom";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { NewPhotoWithLocationIdSpec } from "../models/joi-schemas.js";
import { NewPhotoWithLocationId } from "../models/store-types.js";
import { validationError } from "./logger.js";

export const photoApi = {
  create: {
    auth: false,
    handler: async function(request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photoPayload = request.payload as NewPhotoWithLocationId
        const photo = await db.photoStore.addPhoto(photoPayload);
        return h.response(photo).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    validate: {
      payload: NewPhotoWithLocationIdSpec,
      options: { stripUnknown: true },
      failAction: validationError
    },
  },
  find: {
    auth: false,
    handler: async function(request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photos = await db.photoStore.getAllPhotos();
        return h.response(photos).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  findOne: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photo = await db.photoStore.getPhotoById(request.params.id);
        if (!photo) {
          return Boom.notFound("No Photo with this id");
        }
        return h.response(photo).code(200);
      } catch (err) {
        return Boom.serverUnavailable("No Photo with this id");
      }
    },
  },
  findLocationPhotos: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locations = await db.photoStore.getPhotosByLocationId(request.params.id);
        return h.response(locations).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteAll: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.photoStore.deleteAllPhotos();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  deleteOne: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.photoStore.deletePhoto(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};