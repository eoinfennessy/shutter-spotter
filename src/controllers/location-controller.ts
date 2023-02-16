import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { NewPhotoSpec } from "../models/joi-schemas.js";
import { Photo } from "../models/store-types.js";

const getLocationViewData = async function (request: Request) {
  const location = await db.locationStore.getLocationById(request.params.id);
  const photos = await db.photoStore.getPhotosByLocationId(request.params.id);
  return {
    location: location,
    photos: photos
  };
}

export const locationController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const viewData = await getLocationViewData(request);
      return h.view("location-view", { ...viewData, title: "Location" });
    },
  },

  addPhoto: {
    validate: {
      payload: NewPhotoSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: async function (request: Request, h: ResponseToolkit, error: Record<string, any>): Promise<ResponseObject> {
        const viewData = await getLocationViewData(request);
        return h
          .view("location-view", {
            ...viewData,
            title: "Invalid Photo",
            errors: error.details
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      if (location === null) {
        return h.redirect("/dashboard");
      }
      const newPhoto = request.payload as Omit<Photo, "_id" | "locationId">
      await db.photoStore.addPhoto(location._id, newPhoto);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deletePhoto: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.photoStore.deletePhoto(request.params.photoid);
      if (location) {
        return h.redirect(`/location/${location._id}`);
      }
      return h.redirect("/dashboard");
    },
  },
};
