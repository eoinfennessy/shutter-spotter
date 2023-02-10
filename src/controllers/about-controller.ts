import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export const aboutController = {
  index: {
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const viewData = {
        title: "About ShutterSpotter",
      };
      return h.view("about-view", viewData);
    },
  },
};
