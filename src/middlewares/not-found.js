//เอาไว้ใช้กรณีที่ server ไม่รองรับ
module.exports = (req, res, next) => {
  res.status(404).json({ message: "resource not found on this server" });
};
