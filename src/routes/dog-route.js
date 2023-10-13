const express = require("express");
const dogController = require("../controllers/dog-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");

const router = express.Router();

// 1. CREATE
router.post(
  "/create",
  authenticateMiddleware,
  uploadMiddleware.single("dogImage"),
  dogController.createDog
);

module.exports = router;
