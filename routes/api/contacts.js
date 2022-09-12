const express = require("express");
const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController
} = require("../../controllers/contactsController.js");

const {
  addContactValidation,
  updateContactValidation,
  updateStatusContactValidation
} = require("../../middlewares/validationMiddleware");

const {authMiddleware} = require("../../middlewares/authMiddleware")

const router = new express.Router();

router.get("/", authMiddleware, listContactsController);

router.get("/:contactId", authMiddleware, getContactByIdController);

router.post("/", authMiddleware, addContactValidation, addContactController);

router.delete("/:contactId", authMiddleware, removeContactController);

router.put("/:contactId", authMiddleware, updateContactValidation, updateContactController);

router.patch("/:contactId/favorite", authMiddleware, updateStatusContactValidation, updateStatusContactController);

module.exports = router;
