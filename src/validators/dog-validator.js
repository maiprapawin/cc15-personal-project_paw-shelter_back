const Joi = require("joi");

const createDogSchema = Joi.object({
  dogName: Joi.string().trim().required(),
  gender: Joi.string().required(),
  breed: Joi.string(),
  description: Joi.string(),
});
exports.createDogSchema = createDogSchema;

const updateDogSchema = Joi.object({
  id: Joi.number(),
  dogImage: Joi.string(),
  dogName: Joi.string().trim(),
  gender: Joi.string(),
  breed: Joi.string(),
  description: Joi.string(),
});
exports.updateDogSchema = updateDogSchema;
