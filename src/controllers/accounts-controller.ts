import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import { UserSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";


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
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request: Request, h: ResponseToolkit, error: any): ResponseObject {

        // TODO: remove and fix error type
        console.log(`Error type: ${typeof error}`)
        console.log(`Error attributes: ${error.attributes}`)

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
      const user = request.payload;
      // @ts-ignore
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
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      // @ts-ignore
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
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

  async validate(request: Request, session: any): Promise<{ isValid: boolean, credentials?: any }> {

    // TODO: remove and fix session type
    console.log(`Session type: ${typeof session}`)

    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
