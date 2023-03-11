import axios from "axios";
import { serviceUrl } from "../fixtures.js";
import { NewUser, NewLocationWithUserId, UserCredentials, Name, Email, Password, PhotoApiPayload } from "../../src/models/store-types.js";

export const shutterSpotterService = {
  shutterSpotterUrl: serviceUrl,

  async authenticate(user: UserCredentials) {
    const response = await axios.post(`${this.shutterSpotterUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },

  async createUser(user: NewUser) {
    const res = await axios.post(`${this.shutterSpotterUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id: string) {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/users`);
    return res.data;
  },

  async updateUserName(id: string, name: Name) {
    const res = await axios.patch(`${this.shutterSpotterUrl}/api/users/${id}/name`, name);
    return res.data;
  },

  async updateEmail(id: string, email: { email: Email }) {
    const res = await axios.patch(`${this.shutterSpotterUrl}/api/users/${id}/email`, email);
    return res.data;
  },

  async updatePassword(id: string, password: { password: Password }) {
    const res = await axios.patch(`${this.shutterSpotterUrl}/api/users/${id}/password`, password);
    return res.data;
  },

  async deleteUser(id: string) {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/users/${id}`);
    return res.data;
  },

  async createLocation(location: NewLocationWithUserId) {
    const res = await axios.post(`${this.shutterSpotterUrl}/api/locations`, location);
    return res.data;
  },

  async getLocation(id: string) {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/locations/${id}`);
    return res.data;
  },

  async getAllLocations() {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/locations`);
    return res.data;
  },

  async getUserLocations(userId: string) {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/users/${userId}/locations`);
    return res.data;
  },

  async deleteAllLocations() {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/locations`);
    return res.data;
  },

  async deleteLocation(locationId: string, userId: string) {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/users/${userId}/locations/${locationId}`);
    return res.data;
  },

  async createPhoto(photo: PhotoApiPayload) {
    // @ts-ignore
    const form = new FormData();
    form.append("title", photo.title)
    form.append("userId", photo.userId)
    form.append("locationId", photo.locationId)
    form.append("description", photo.description)
    form.append("tags", photo.tags)
    form.append("imagefile", new Blob([photo.imagefile]))
    const res = await axios.post(`${this.shutterSpotterUrl}/api/photos`, form)
    return res.data;
  },

  async getPhoto(id: string) {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/photos/${id}`);
    return res.data;
  },

  async getLocationPhotos(photoId: string) {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/locations/${photoId}/photos`);
    return res.data;
  },

  async getAllPhotos() {
    const res = await axios.get(`${this.shutterSpotterUrl}/api/photos`);
    return res.data;
  },

  async deleteAllPhotos() {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/photos`);
    return res.data;
  },

  async deletePhoto(id: string) {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/photos/${id}`);
    return res.data;
  },
};
