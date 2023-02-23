import Joi from "joi";

export const UserCredentialsSpec = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required() // .min(8)
});

export const NewUserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

export const UserSpec = NewUserSpec.keys({
  _id: Joi.string().required()
});

export const NewLocationSpec = Joi.object().keys({
  name: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
});

export const NewLocationWithUserIdSpec = NewLocationSpec.keys({
  userId: Joi.string().required()
})

export const NewPhotoSpec = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required().max(300),
});

export const NewPhotoWithLocationIdSpec = NewPhotoSpec.keys({
  locationId: Joi.string().required()
})