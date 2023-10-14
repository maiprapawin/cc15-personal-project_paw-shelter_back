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

const checkDogIdSchema = Joi.object({
  dogId: Joi.number().integer().positive().required(),
  //obj ที่จะ validate มี key ที่ชื่อว่า id
  //ต้องเป็นตัวเลข จำนวนเต็ม เลขบวก และต้องมีค่า
});
exports.checkDogIdSchema = checkDogIdSchema;
