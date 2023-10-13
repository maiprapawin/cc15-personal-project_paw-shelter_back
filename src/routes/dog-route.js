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

// 2. READ
router.get("/read", authenticateMiddleware, dogController.readAllDogs);

// 3. UPDATE
router.patch(
  "/update",
  authenticateMiddleware,
  adminAuthenticateMiddleware,
  uploadMiddleware.single("dogImage"),
  dogController.updateDog
);

module.exports = router;
