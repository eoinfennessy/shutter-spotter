import bcrypt from "bcrypt"
import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import { UserCredentialsSpec, NewUserSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { NewUser, User, UserCredentials } from "../types/schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      return h.view("main", { title: "Welcome to ShutterSpotter" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      return h.view("signup-view", { title: "Sign up for ShutterSpotter" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: NewUserSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: function (request: Request, h: ResponseToolkit, error: Record<string, any>): ResponseObject {
        return h
          .view("signup-view", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const user = request.payload as NewUser;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },

  showLogin: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      return h.view("login-view", { title: "Login to ShutterSpotter" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: function (request: Request, h: ResponseToolkit, error: Record<string, any>): ResponseObject {
        return h
          .view("login-view", {
            title: "Login Error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const payload = request.payload as UserCredentials;
      const user = await db.userStore.getUserByEmail(payload.email);
      if (!user) return h.redirect("/");
      const passwordsMatch: boolean = await bcrypt.compare(payload.password, user.password);
      if (!passwordsMatch) return h.redirect("/");
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  logout: {
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request: Request, session: { id: string }): Promise<{ isValid: true; credentials: User } | { isValid: false }> {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
