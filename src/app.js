require("dotenv").config(); //เอาทุกอย่างที่อยู่ในไฟล์ .env ไปเก็บไว้ใน process.env ให้เรา
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const authRoute = require("./routes/auth-route");
const dogRoute = require("./routes/dog-route");

const app = express();

/// Middleware ของคนอื่นที่เราจะใช้
app.use(cors()); //allow ทุก origin
app.use(morgan("dev")); //เอาไว้ log ใน terminal ตอนที่ dev
app.use(express.json()); //เพื่อ pass body

/// Routes ที่เราสร้าง
app.use("/auth", authRoute);
app.use("/dog", dogRoute);

/// Middleware ที่เราสร้างเอง
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
