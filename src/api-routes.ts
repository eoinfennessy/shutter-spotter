import { userApi } from "./api/user-api.js";
import { locationApi } from "./api/location-api.js";
import { photoApi } from "./api/photo-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },

  { method: "GET", path: "/api/locations", config: locationApi.find },
  { method: "GET", path: "/api/locations/{id}", config: locationApi.findOne },
  { method: "GET", path: "/api/users/{id}/locations", config: locationApi.findUserLocations },
  { method: "POST", path: "/api/locations", config: locationApi.create },
  { method: "DELETE", path: "/api/locations", config: locationApi.deleteAll },
  { method: "DELETE", path: "/api/locations/{id}", config: locationApi.deleteOne },

  { method: "GET", path: "/api/photos", config: photoApi.find },
  { method: "GET", path: "/api/photos/{id}", config: photoApi.findOne },
  { method: "GET", path: "/api/locations/{id}/photos", config: photoApi.findLocationPhotos },
  { method: "POST", path: "/api/photos", config: photoApi.create },
  { method: "DELETE", path: "/api/photos", config: photoApi.deleteAll },
  { method: "DELETE", path: "/api/photos/{id}", config: photoApi.deleteOne },

  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];