require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
