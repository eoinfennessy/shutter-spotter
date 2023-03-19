import Boom from "@hapi/boom";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { imageStore } from "../models/file-storage/image-store.js";
import { IdSpec, PhotoApiPayloadSpec, PhotoArray, PhotoSpec } from "../models/joi-schemas.js";
import { NewPhoto, PhotoApiPayload } from "../models/store-types.js";
import { validationError } from "./logger.js";

export const photoApi = {
  create: {
    auth: {
      strategy: "jwt",
      scope: ["user-{payload.userId}", "admin", "super-admin"],
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photoPayload = request.payload as PhotoApiPayload;
        const imgUri = await imageStore.uploadImage(photoPayload.imagefile);
        const newPhoto = {
          title: photoPayload.title,
          description: photoPayload.description,
          locationId: photoPayload.locationId,
          userId: photoPayload.userId,
          img: imgUri,
          tags: photoPayload.tags !== "" ? photoPayload.tags.split(" ") : [],
          comments: [],
          voteScore: 0,
          votes: [],
        } as NewPhoto;
        const photo = await db.photoStore.addPhoto(newPhoto);
        return h.response(photo).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a photo",
    notes: "Returns the newly created photo",
    validate: { payload: PhotoApiPayloadSpec, options: { stripUnknown: true }, failAction: validationError },
    response: { schema: PhotoSpec, failAction: validationError },
  },

  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photos = await db.photoStore.getAllPhotos();
        return h.response(photos).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns details of all photos",
    response: { schema: PhotoArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
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
    tags: ["api"],
    description: "Get a specific photo",
    notes: "Returns details of photo matching specified ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PhotoSpec, failAction: validationError },
  },

  findLocationPhotos: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const locations = await db.photoStore.getPhotosByLocationId(request.params.id);
        return h.response(locations).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos taken at location",
    notes: "Returns details of all photos matching specified location ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PhotoArray, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
      scope: "super-admin",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.photoStore.deleteAllPhotos();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes all photos",
    notes: "Deletes all photos from ShutterSpotter's DB",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
      scope: ["user-{payload.userId}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const photo = await db.photoStore.getPhotoById(request.params.id);
        if (photo === null) return Boom.notFound("No photo with this ID");
        if (photo.userId !== request.params.userId) {
          return Boom.badRequest("User ID request param does not match user ID of resource owner");
        }
        await db.photoStore.deletePhoto(request.params.id);
        await imageStore.deleteImage(photo.img);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes a photo",
    notes: "Deletes photo matching specified photo ID from the ShutterSpotter DB",
    validate: { params: { id: IdSpec, userId: IdSpec }, failAction: validationError },
  },
};
