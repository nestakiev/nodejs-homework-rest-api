const express = require("express");
const router = new express.Router();

const {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateUsersSubcriptionController
} = require("../../controllers/authController");

const { authMiddleware } = require("../../middlewares/authMiddleware");

const {
  registrationAndLoginValidation,
} = require("../../middlewares/validationMiddleware");

router.post(
  "/register",
  registrationAndLoginValidation,
  registrationController
);

router.post("/login", registrationAndLoginValidation, loginController);

router.post("/logout", authMiddleware, logoutController);

router.get("/current", authMiddleware, currentUserController);

router.patch("/", authMiddleware, updateUsersSubcriptionController);

module.exports = router;
