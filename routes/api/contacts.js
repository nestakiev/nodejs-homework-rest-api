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

const router = new express.Router();

router.get("/", listContactsController);

router.get("/:contactId", getContactByIdController);

router.post("/", addContactValidation, addContactController);

router.delete("/:contactId", removeContactController);

router.put("/:contactId", updateContactValidation, updateContactController);

router.patch("/:contactId/favorite", updateStatusContactValidation, updateStatusContactController);

module.exports = router;
