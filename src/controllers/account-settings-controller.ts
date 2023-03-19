import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { EmailSpec, NameSpec, PasswordSpec } from "../models/joi-schemas.js";
import { Email, Name, Password, User } from "../types/schemas.js";

export const accountSettingsController = {
  index: {
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const viewData = {
        title: "Account Settings",
      };
      return h.view("account-settings-view", viewData);
    },
  },

  updateName: {
    validate: {
      payload: NameSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: function (request: Request, h: ResponseToolkit, error: Record<string, any>): ResponseObject {
        return h
          .view("account-settings-view", {
            title: "Invalid Input",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const loggedInUser = request.auth.credentials as User;
      const newName = request.payload as Name;
      db.userStore.updateName(loggedInUser._id, newName);
      return h.redirect("/accountsettings");
    },
  },

  updateEmail: {
    validate: {
      payload: EmailSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: function (request: Request, h: ResponseToolkit, error: Record<string, any>): ResponseObject {
        return h
          .view("account-settings-view", {
            title: "Invalid Input",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const loggedInUser = request.auth.credentials as User;
      const { email } = request.payload as Record<"email", Email>;
      db.userStore.updateEmail(loggedInUser._id, email);
      return h.redirect("/accountsettings");
    },
  },

  updatePassword: {
    validate: {
      payload: PasswordSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: function (request: Request, h: ResponseToolkit, error: Record<string, any>): ResponseObject {
        return h
          .view("account-settings-view", {
            title: "Invalid Input",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const loggedInUser = request.auth.credentials as User;
      const { password } = request.payload as Record<"password", Password>;
      db.userStore.updatePassword(loggedInUser._id, password);
      return h.redirect("/accountsettings");
    },
  },

  deleteAccount: {
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      const loggedInUser = request.auth.credentials as User;
      db.userStore.deleteUserById(loggedInUser._id);
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};
