import { userApi } from "./api/user-api.js";
import { locationApi } from "./api/location-api.js";
import { photoApi } from "./api/photo-api.js";
import { analyticsApi } from "./api/analytics-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "POST", path: "/api/users/github", config: userApi.createWithGithub },
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
  { method: "POST", path: "/api/users/authenticate/github", config: userApi.authenticateWithGithub },
  { method: "PATCH", path: "/api/users/{id}/name", config: userApi.updateName },
  { method: "PATCH", path: "/api/users/{id}/email", config: userApi.updateEmail },
  { method: "PATCH", path: "/api/users/{id}/password", config: userApi.updatePassword },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },

  { method: "GET", path: "/api/locations", config: locationApi.find },
  { method: "GET", path: "/api/locations/{id}", config: locationApi.findOne },
  { method: "GET", path: "/api/users/{id}/locations", config: locationApi.findUserLocations },
  { method: "POST", path: "/api/locations", config: locationApi.create },
  { method: "DELETE", path: "/api/locations", config: locationApi.deleteAll },
  { method: "DELETE", path: "/api/users/{userId}/locations/{locationId}", config: locationApi.deleteOne },

  { method: "GET", path: "/api/photos", config: photoApi.find },
  { method: "GET", path: "/api/photos/{id}", config: photoApi.findOne },
  { method: "GET", path: "/api/users/{id}/photos", config: photoApi.findUserPhotos },
  { method: "GET", path: "/api/locations/{id}/photos", config: photoApi.findLocationPhotos },
  { method: "POST", path: "/api/photos", config: photoApi.create },
  { method: "DELETE", path: "/api/photos", config: photoApi.deleteAll },
  { method: "DELETE", path: "/api/users/{userId}/photos/{id}", config: photoApi.deleteOne },

  { method: "GET", path: "/api/analytics/user-count", config: analyticsApi.getUserCount },
  { method: "GET", path: "/api/analytics/location-count", config: analyticsApi.getLocationCount },
  { method: "GET", path: "/api/analytics/location-count-by-category", config: analyticsApi.getLocationCountByCategory },
  { method: "GET", path: "/api/analytics/photo-count", config: analyticsApi.getPhotoCount },
  { method: "GET", path: "/api/analytics/user-creation-times", config: analyticsApi.getAllUserCreationTimes },
];
