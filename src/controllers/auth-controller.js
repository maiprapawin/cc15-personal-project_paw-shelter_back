const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    // 1. read ค่าใน body
    // 2. validate โดยใช้ joi ช่วย
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // 3. hash password
    value.password = await bcrypt.hash(value.password, 10);
    console.log(value);

    // 4. create ข้อมูลเข้า database
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
    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const user = await prisma.user.findFirst({
      //หา user จากตาราง db user
      where: {
        email: value.email,
      },
    });
    if (!user) {
      return next(createError("invalid credential", 400));
    }

    //ถ้าหา user เจอจากใน db แล้ว ต้อง compare กับที่ user signup มา
    //value.password = ค่าที่อยู่ใน req.body
    //user.password = มาจากที่หาเจอใน db
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }
    //client sends req to server => server validate login => compare password => if ok = gen accessToken and send back to client => client stores in local storage
    const payload = { userId: user.id };
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
