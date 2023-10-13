const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    // 1. Read ค่าใน request body ดูว่าเป็นยังไง ครบถ้วนไหม (มาจาก AuthContext ฝั่ง frontend)
    // 2. Validate โดยใช้ Joi ช่วย
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // 3. Hash password
    value.password = await bcrypt.hash(value.password, 10);
    console.log(value);

    // 4. Create ข้อมูลเข้า database
    const user = await prisma.user.create({
      data: value,
    });
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dkfjldfjlkdfssddd",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete user.password;
    res.status(201).json({ accessToken, user }); //response กลับไปหาฝั่ง frontend
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  //client sends req to server => server validate login => compare password

  //// 1. Validate Login
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await prisma.user.findFirst({
      //หา user จากตาราง db user //ถ้าหาเจอ return user obj
      where: {
        email: value.email,
      },
    });
    //ถ้าหา user ไม่เจอ
    if (!user) {
      return next(createError("invalid credential", 400));
    }

    //// 2. Compare Password

    //ถ้าหา user เจอจากใน db แล้ว ต้อง compare กับที่ user signup มา
    //value.password = ค่าที่อยู่ใน req.body //user.password = มาจากที่หาเจอใน db
    const isMatch = await bcrypt.compare(value.password, user.password);

    //ถ้า password ไม่ตรงกัน
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }

    //// 3. Server generates accessToken to user (user stores in local storage)
    const payload = { userId: user.id }; //payload = ข้อมูลที่ยืนยันตัวตนของ user ได้ แต่ไม่ใช่ข้อมูลที่ sensitive/confidential
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "dkfjldfjlkdfssddd",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
