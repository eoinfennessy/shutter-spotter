import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import { db } from "../models/db.js";
import { ScopeSpec } from "../models/joi-schemas.js";

const getAnalytics = async function () {
  const promises = [];
  promises.push(db.userStore.count());
  promises.push(db.locationStore.count());
  promises.push(db.photoStore.count());
  const locationCountByCategory = await db.locationStore.countByCategory();
  const [userCount, locationCount, photoCount] = await Promise.all(promises);
  const avgLocationsPerUser = userCount !== 0 ? locationCount / userCount : 0;
  const avgPhotosPerUser = userCount !== 0 ? photoCount / userCount : 0;
  const avgPhotosPerLocation = locationCount !== 0 ? photoCount / locationCount : 0;
  return {
    userCount: userCount,
    locationCount: locationCount,
    photoCount: photoCount,
    locationCountByCategory: locationCountByCategory,
    // Format to at most 2 decimal places while removing trailing zeroes
    avgLocationsPerUser: +avgLocationsPerUser.toFixed(2),
    avgPhotosPerUser: +avgPhotosPerUser.toFixed(2),
    avgPhotosPerLocation: +avgPhotosPerLocation.toFixed(2),
  };
};

export const adminController = {
  index: {
    auth: {
      strategy: "session",
      scope: ["admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const analytics = await getAnalytics();
      return h.view("admin-dashboard-view", { ...analytics, title: "Admin Dashboard" });
    },
  },

  accounts: {
    auth: {
      strategy: "session",
      scope: ["admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      const users = await db.userStore.getAllUsers();
      return h.view("accounts-view", { title: "Admin - User Accounts", accounts: users });
    },
  },

  deleteAccount: {
    auth: {
      strategy: "session",
      scope: ["admin", "super-admin"],
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      await db.userStore.deleteUserById(request.params.id);
      return h.redirect("/admin/accounts");
    },
  },

  addScope: {
    auth: {
      strategy: "session",
      scope: ["super-admin"],
    },
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
      const payload = request.payload as Record<"scope", string>;
      await db.userStore.addScope(request.params.id, payload.scope);
      return h.redirect("/admin/accounts");
    },
  },
};
