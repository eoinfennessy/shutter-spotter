import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import Joi from "joi";
import { db } from "../models/db.js";
import { ScopeSpec } from "../models/joi-schemas.js";

export const adminController = {
  index: {
    handler: function (request: Request, h: ResponseToolkit): ResponseObject {
      return h.view("admin-dashboard-view", { title: "Admin Dashboard" });
    },
  },
  
  accounts: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const users = await db.userStore.getAllUsers();
      return h.view("accounts-view", { title: "Admin - User Accounts", accounts: users });
    },
  },

  deleteAccount: {
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      await db.userStore.deleteUserById(request.params.id);
      return h.redirect("/admin/accounts");
    },
  },
  
  addScope: {
    validate: {
      payload: ScopeSpec,
      options: { abortEarly: false, stripUnknown: true },
      failAction: async function (request: Request, h: ResponseToolkit, error: Record<string, any>): Promise<ResponseObject> {
        return h
          .view("accounts-view", {
            title: "Invalid Input",
            accounts: await db.userStore.getAllUsers(),
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const payload = request.payload as Record<"scope", string>
      await db.userStore.addScope(request.params.id, payload.scope);
      return h.redirect("/admin/accounts");
    },
  },
}