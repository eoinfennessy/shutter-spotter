import Boom from "@hapi/boom";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { createToken } from "./jwt-utils.js";
import { db } from "../models/db.js";
import { EmailSpec, IdSpec, JwtAuth, NameSpec, NewUserSpec, PasswordSpec, UserArray, UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";
import { Email, Name, NewUser, Password, UserCredentials } from "../types/schemas.js";
import { validationError } from "./logger.js";

export const userApi = {
  authenticate: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      const payload = request.payload as UserCredentials;
      try {
        const user = await db.userStore.getUserByEmail(payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Authenticates a User",
    notes: "Creates and return a JWT token if user's credentials are valid; otherwise returns 401 error.",
    validate: { payload: UserCredentialsSpec, options: { stripUnknown: true }, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError },
  },

  create: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const userPayload = request.payload as NewUser;
        const user = await db.userStore.addUser(userPayload);
        return h.response(user).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: NewUserSpec, options: { stripUnknown: true }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  find: {
    auth: {
      strategy: "jwt",
      scope: ["admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const users = await db.userStore.getAllUsers();
        return h.response(users).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all users",
    response: { schema: UserArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.id}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return h.response(user).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details matching specified ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  updateName: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.id}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        const user = await db.userStore.updateName(request.params.id, request.payload as Name);
        if (user === null) {
          return Boom.notFound("No user found matching the provided ID");
        }
        return h.response(user).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Updates a user's name",
    notes: "Updates first and last names of user matching specified ID",
    validate: { payload: NameSpec, options: { stripUnknown: true }, params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  updateEmail: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.id}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      const payload = request.payload as { email: Email };
      try {
        const user = await db.userStore.updateEmail(request.params.id, payload.email);
        if (user === null) {
          return Boom.notFound("No user found matching the provided ID");
        }
        return h.response(user).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Updates a user's email",
    notes: "Updates email address of user matching specified ID",
    validate: { payload: EmailSpec, options: { stripUnknown: true }, params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  updatePassword: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.id}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      const payload = request.payload as { password: Password };
      try {
        const user = await db.userStore.updatePassword(request.params.id, payload.password);
        if (user === null) {
          return Boom.notFound("No user found matching the provided ID");
        }
        return h.response(user).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Updates a user's password",
    notes: "Updates password of user matching specified ID",
    validate: { payload: PasswordSpec, options: { stripUnknown: true }, params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
      scope: "super-admin",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Deletes all users from the ShutterSpotter DB",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
      scope: ["user-{params.id}", "admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject | Boom.Boom<string>> {
      try {
        await db.userStore.deleteUserById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes specific user",
    notes: "Deletes user matching specified ID from the ShutterSpotter DB",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
};
