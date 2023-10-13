const express = require("express");
const dogController = require("../controllers/dog-controller");
const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");
const adminAuthenticateMiddleware = require("../middlewares/admin-authenticate");

const router = express.Router();

// 1. CREATE
router.post(
  "/create",
  authenticateMiddleware,
  adminAuthenticateMiddleware,
  uploadMiddleware.single("dogImage"),
  dogController.createDog
);

module.exports = router;
