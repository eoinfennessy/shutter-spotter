import Joi from "joi";

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required() // .min(8)
};

export const UserLoginSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const LocationSpec = {
  name: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
};

export const PhotoSpec = {
  title: Joi.string().required(),
  description: Joi.string().required().max(300),
};