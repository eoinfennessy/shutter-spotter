import Joi from "joi";

export const IdSpec = Joi.string().required().label("IdSpec")

export const JwtAuth = Joi.object().keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
}).label("JwtAuth");

// User

export const EmailSpec = Joi.object().keys({
  email: Joi.string().email().required().example("joe@bloggs.com")
}).label("EmailSpec");

export const PasswordSpec = Joi.object().keys({
  password: Joi.string().required().example("topsecret")
}).label("PasswordSpec");

export const NameSpec = Joi.object().keys({
  firstName: Joi.string().required().example("Joe"),
  lastName: Joi.string().required().example("Bloggs")
}).label("NameSpec");

export const UserCredentialsSpec = EmailSpec
  .concat(PasswordSpec)
  .label("UserCredentialsSpec");

export const NewUserSpec = UserCredentialsSpec
  .concat(NameSpec)
  .label("NewUserSpec");

export const UserSpec = NewUserSpec.keys({
  _id: IdSpec,
  scope: Joi.array().items(Joi.string()).required().example(["user", "user-1234asdf", "admin"])
}).label("UserSpec");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

// Location

export const NewLocationSpec = Joi.object().keys({
  name: Joi.string().required().example("Waterford"),
  latitude: Joi.number().min(-90).max(90).example(52.25833),
  longitude: Joi.number().min(-180).max(180).example(-7.11194)
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
  title: Joi.string().required().example("Dunmore East Sunset"),
  description: Joi.string().required().max(300).example("A beautiful sunset at Dunmore East"),
}).label("NewPhotoSpec");

export const NewPhotoWithLocationIdSpec = NewPhotoSpec.keys({
  locationId: IdSpec
}).label("NewPhotoWithLocationIdSpec");

export const PhotoSpec = NewPhotoWithLocationIdSpec.keys({
  _id: IdSpec
}).label("PhotoSpec");

export const PhotoArray = Joi.array().items(PhotoSpec).label("PhotoArray");
