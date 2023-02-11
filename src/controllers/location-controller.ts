import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { isNewPhoto } from "../utils/type-gaurds.js";

export const locationController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      const photos = await db.photoStore.getPhotosByLocationId(request.params.id);
      const viewData = {
        title: "Location",
        location: location,
        photos: photos
      };
      return h.view("location-view", viewData);
    },
  },

  addPhoto: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      const newPhoto = {
        // @ts-ignore
        title: request.payload.title,
        // @ts-ignore: 
        description: request.payload.description,
      };
      if (location && isNewPhoto(newPhoto)) {
        await db.photoStore.addPhoto(location._id, newPhoto);
        return h.redirect(`/location/${location._id}`);
      } else {
        return h.redirect("/dashboard");
      }
    },
  },

  deletePhoto: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.photoStore.deletePhoto(request.params.photoid);
      if (location) {
        return h.redirect(`/location/${location._id}`);
      } else {
        return h.redirect("/dashboard");
      }
    },
  },
};
