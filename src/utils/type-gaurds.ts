import { Location, Photo, User } from "../models/store-types"


export const isNewPhoto = function (input: any): input is Omit<Photo, "_id" | "locationId"> {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof input.title === 'string' &&
    typeof input.description === 'string'
  );
}

export const isNewLocation = function (input: any): input is Omit<Location, "_id"> {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof input.userId === 'string' &&
    typeof input.latitude === 'number' &&
    typeof input.longitude === 'number'
  );
}

export const isNewUser = function (input: any): input is Omit<User, '_id'> {
  return (
    typeof input === 'object' &&
    input !== null &&
    typeof input.firstName === 'string' &&
    typeof input.lastName === 'string' &&
    typeof input.email === 'string' &&
    typeof input.password === 'string'
  );
}