import axios from "axios";
import { serviceUrl } from "../fixtures.js";
import { Location, NewUser, User, NewLocationWithUserId, NewPhotoWithLocationId } from "../../src/models/store-types.js"

export const shutterSpotterService = {
  shutterSpotterUrl: serviceUrl,

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

  async deleteLocation(id: string) {
    const res = await axios.delete(`${this.shutterSpotterUrl}/api/locations/${id}`);
    return res.data;
  },

  async createPhoto(photo: NewPhotoWithLocationId) {
    const res = await axios.post(`${this.shutterSpotterUrl}/api/photos`, photo);
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
}