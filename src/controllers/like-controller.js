const prisma = require("../models/prisma");
const { checkDogIdSchema } = require("../validators/dog-validator");
const createError = require("../utils/create-error");

exports.toggleLike = async (req, res, next) => {
  try {
    const { value, error } = checkDogIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const existDog = await prisma.dog.findUnique({
      where: {
        id: value.dogId,
      },
    });

    if (!existDog) {
      return next(createError("dog does not exist", 400));
    }

    // เช็คว่ามี like อยู่่ไหม ถ้ามีต้องลบ ถ้าไม่มี ต้องเพิ่ม
    const existLike = await prisma.like.findFirst({
      where: {
        userId: req.user.id,
        dogId: value.dogId,
      },
    });

    //// 1. มีไลค์อยู่ ต้องลบออกจากตาราง
    if (existLike) {
      await prisma.like.delete({
        where: { id: existLike.id },
      });

      return res.status(200).json({ message: "unliked" });
    }

    //// 2. ยังไม่มีไลค์ ต้องเพิ่มเข้าตาราง
    await prisma.like.create({
      data: {
        userId: req.user.id,
        dogId: value.dogId,
      },
    });
    res.status(200).json({ message: "liked" });
  } catch (err) {
    next(err);
  }
};
