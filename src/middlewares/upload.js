const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); //เก็บรูปไว้ที่ public
  },
  filename: (req, file, cb) => {
    const split = file.originalname.split(".");
    cb(
      null,
      "" +
        Date.now() +
        Math.round(Math.random() * 10000000) +
        "." +
        split[split.length - 1]
    ); //ตั้งชื่อไฟล์เป็นเวลา
  },
});

const upload = multer({ storage: storage });
module.exports = upload;

/* 
Multer เป็น middleware ที่คล้่ายๆ express json เอาไว้ pass req body ในรูปแบบที่เป็น multipart/form-data ส่งข้อมูลในรูปแบบ binary/file ได้ (ถ้า json ส่งเป็นไฟล์ไม่ได้)

- req = multer pass ค่า req obj ให้เราใช้ได้
- file = ข้อมูลไฟล์รูปที่เราอัพ เช่น original name, file info
- cb = callback fn 
    รับ para1 บอกว่า err เกิดขึ้น แต่ถ้าไม่อยากให้มี err ก็ต้อง pass ค่าเป็น null
        >> cb(newError(),...)
        >> cb(null,...)
    para2 
        >> เป็น path ที่เราจะเก็บรูป
*/
