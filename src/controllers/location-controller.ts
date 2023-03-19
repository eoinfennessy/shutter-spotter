import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { imageStore } from "../models/file-storage/image-store.js";
import { PhotoPayloadSpec } from "../models/joi-schemas.js";
import { NewPhoto, PhotoPayload } from "../models/store-types.js";

const getLocationViewData = async function (request: Request) {
  const location = await db.locationStore.getLocationById(request.params.id);
  const photos = await db.photoStore.getPhotosByLocationId(request.params.id);
  return {
    location: location,
    photos: photos,
  };
};

export const locationController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const viewData = await getLocationViewData(request);
      return h.view("location-view", { ...viewData, title: "Location" });
    },
  },

  addPhoto: {
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
    validate: {
      payload: PhotoPayloadSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: async function (request: Request, h: ResponseToolkit, error: Record<string, any>): Promise<ResponseObject> {
        const viewData = await getLocationViewData(request);
        return h
          .view("location-view", {
            ...viewData,
            title: "Invalid Photo",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const payload = request.payload as PhotoPayload;
      const location = await db.locationStore.getLocationById(request.params.id);
      if (location === null) {
        return h.redirect("/dashboard");
      }
      const imgUri = await imageStore.uploadImage(payload.imagefile);
      const newPhoto = {
        title: payload.title,
        description: payload.description,
        locationId: location._id,
        userId: request.auth.credentials._id,
        img: imgUri,
        tags: payload.tags !== "" ? payload.tags.split(" ") : [],
        comments: [],
        voteScore: 0,
        votes: [],
      } as NewPhoto;
      await db.photoStore.addPhoto(newPhoto);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deletePhoto: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const photo = await db.photoStore.getPhotoById(request.params.photoid);
      if (photo && photo.userId === request.auth.credentials._id) {
        await imageStore.deleteImage(photo.img);
        await db.photoStore.deletePhoto(photo._id);
      }
      return h.redirect(`/location/${request.params.id}`);
    },
  },
};
