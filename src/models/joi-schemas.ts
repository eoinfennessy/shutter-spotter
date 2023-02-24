import Joi from "joi";

export const IdSpec = Joi.string().required().label("IdSpec")

// User

export const UserCredentialsSpec = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required() // .min(8)
}).label("UserCredentialsSpec");

export const NewUserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
}).label("NewUserSpec");

export const UserSpec = NewUserSpec.keys({
  _id: IdSpec
}).label("UserSpec");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

// Location

export const NewLocationSpec = Joi.object().keys({
  name: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
}).label("NewLocationSpec");

export const NewLocationWithUserIdSpec = NewLocationSpec.keys({
  userId: IdSpec
}).label("NewLocationWithUserIdSpec");

export const LocationSpec = NewLocationWithUserIdSpec.keys({
  _id: IdSpec
}).label("LocationSpec")

export const LocationArray = Joi.array().items(LocationSpec).label("LocationArray");

// Photo

export const NewPhotoSpec = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required().max(300),
}).label("NewPhotoSpec");

export const NewPhotoWithLocationIdSpec = NewPhotoSpec.keys({
  locationId: IdSpec
}).label("NewPhotoWithLocationIdSpec");

export const PhotoSpec = NewPhotoWithLocationIdSpec.keys({
  _id: IdSpec
}).label("PhotoSpec");

export const PhotoArray = Joi.array().items(PhotoSpec).label("PhotoArray");
