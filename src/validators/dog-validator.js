const Joi = require("joi");

const createDogSchema = Joi.object({
  dogName: Joi.string().trim().required(),
  gender: Joi.string().required(),
  breed: Joi.string(),
  description: Joi.string(),
});

exports.createDogSchema = createDogSchema;
