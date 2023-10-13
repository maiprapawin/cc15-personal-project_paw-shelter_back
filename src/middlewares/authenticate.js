const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

/// Function นี้ไว้อ่านค่า token ใน Headers แล้วเอา token นั้นมา verify
//ตอน express รับ req เข้ามา จะสร้าง obj ให้เรา จาก key ที่ client ส่งเข้ามา ให้เราเรียกใช้ได้เลย

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers; // const authorization = req.headers.authorization;

    //บางทีไม่มีค่า Authorization มาให้ใน Headers จาก client (undefined, ไม่ได้ระบุตัวตน)
    //ถ้าอ่านค่าได้ ค่าจะเป็น string เสมอ
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenticated", 401));
    }
    const token = authorization.split(" ")[1]; //index 0 = Bearer, index 1 = ก้อน token, split ด้วย white space

    //เอา token ไป verify
    //ถ้า verify ผ่าน จะได้ payload = user คนนั้นมีอยู่
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "dkfjldfjlkdfssddd"
    );

    //ค้นหา user ว่าข้อมูลใน payload มี id ใน payload นั้นไหม
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      return next(createError("unauthenticated", 401));
    }

    delete user.password;
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
