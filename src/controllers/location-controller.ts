import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";

export const locationController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      const viewData = {
        title: "Location",
        location: location,
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
        // @ts-ignore
        description: request.payload.description,
      };
      await db.photoStore.addPhoto(location._id, newPhoto);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deletePhoto: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.photoStore.deletePhoto(request.params.photoid);
      return h.redirect(`/location/${location._id}`);
    },
  },
};
