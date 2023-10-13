const fs = require("fs/promises");
const {
  createDogSchema,
  updateDogSchema,
} = require("../validators/dog-validator");
const prisma = require("../models/prisma");
const { uploadToCloudinary } = require("../utils/cloudinary-service");
const createError = require("../utils/create-error");

exports.createDog = async (req, res, next) => {
  try {
    // 1. Validate req.body by Joi (value อยู่ใน req.body)
    const { value, error } = createDogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // 2. Check dogImage (ถ้ามีไฟล์รูป จะอยู่่ใน req.file ซึ่งเป็น obj ที่มี key ชื่อ path)
    // ถ้ามีรูป = 1. อัพรูปขึ้น cloudinary 2. เพิ่ม key ชื่อ dogImage เข้าไปใน obj value
    req.file
      ? (value.dogImage = await uploadToCloudinary(req.file.path))
      : next(createError("image is required"), 400);

    // 3. Create into db
    const dog = await prisma.dog.create({
      data: value,
    });
    res.status(201).json({ message: "created", dog });
  } catch (err) {
    next(err);
  } finally {
    fs.unlink(req.file.path); //ลบรูปออกจากโฟล์เดอร์ public
  }
};

exports.readAllDogs = async (req, res, next) => {
  try {
    const dogs = await prisma.dog.findMany();
    res.status(200).json({ dogs });
  } catch (err) {
    next(err);
  }
};

exports.updateDog = async (req, res, next) => {
  try {
    const { value, error } = updateDogSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    req.file
      ? (value.dogImage = await uploadToCloudinary(req.file.path))
      : next(createError("image is required"), 400);

    const dog = await prisma.dog.update({
      data: value,
      where: {
        id: value.id,
      },
    });

    res.status(200).json({ message: "updated", dog });
  } catch (err) {
    next(err);
  } finally {
    fs.unlink(req.file.path);
  }
};
