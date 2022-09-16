const express = require("express");
const router = new express.Router();

const {
  registrationController,
  verifyController,
  repeatVarifyMessageController,
  loginController,
  logoutController,
  currentUserController,
  updateUsersSubcriptionController,
  updateAvatarController,
} = require("../../controllers/authController");

const { authMiddleware } = require("../../middlewares/authMiddleware");
const {
  uploadMulterMiddleware,
} = require("../../middlewares/uploadMulterMiddleware");

const {
  registrationAndLoginValidation,
  repeatVerifyMessageValidation,
} = require("../../middlewares/validationMiddleware");

router.post(
  "/register",
  registrationAndLoginValidation,
  registrationController
);

router.post("/login", registrationAndLoginValidation, loginController);

router.get("/verify/:verificationToken", verifyController);

router.post("/verify", repeatVerifyMessageValidation, repeatVarifyMessageController);

router.post("/logout", authMiddleware, logoutController);

router.get("/current", authMiddleware, currentUserController);

router.patch("/", authMiddleware, updateUsersSubcriptionController);

router.patch(
  "/avatars",
  authMiddleware,
  uploadMulterMiddleware.single("avatar"),
  updateAvatarController
);

module.exports = router;
