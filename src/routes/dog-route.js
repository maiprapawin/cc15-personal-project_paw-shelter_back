const express = require("express");
const uploadMiddleware = require("../middlewares/upload");
const authenticateMiddleware = require("../middlewares/authenticate");
const adminAuthenticateMiddleware = require("../middlewares/admin-authenticate");
const dogController = require("../controllers/dog-controller");
const likeController = require("../controllers/like-controller");

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
router.get("/read/:dogId", authenticateMiddleware, dogController.readOneDog);

// 3. UPDATE
router.patch(
  "/update",
  authenticateMiddleware,
  adminAuthenticateMiddleware,
  uploadMiddleware.single("dogImage"),
  dogController.updateDog
);

// 4. DELETE
router.delete(
  "/:dogId",
  authenticateMiddleware,
  adminAuthenticateMiddleware,
  dogController.deleteDog
);

/// LIKE ///
router.post("/:dogId/like", authenticateMiddleware, likeController.toggleLike);

module.exports = router;
