const {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
} = require("../services/contactsService");
const { isValidObjectId } = require("mongoose");

const listContactsController = async (request, response) => {
  const { _id: userId } = request.user;
  let { page = 1, limit = 10, favorite = false } = request.query;

  limit = limit > 20 ? 20 : limit;
  const skip = (page - 1) * limit;

  const contacts = await getAllContacts(userId, favorite, skip, limit);
  response.status(200).json(contacts);
};

const getContactByIdController = async (request, response) => {
  const { _id: userId } = request.user;
  const id = request.params.contactId;
  const isValidContactId = isValidObjectId(id);

  if (!isValidContactId) {
    return response.status(404).json({ message: "Not found" });
  }

  const contactById = await getContactById(id, userId);

  if (!contactById) {
    return response.status(404).json({ message: "Not found" });
  }

  response.status(200).json(contactById);
};

const removeContactController = async (request, response) => {
  const id = request.params.contactId;
  const isValidContactId = isValidObjectId(id);

  const { _id: userId } = request.user;

  if (!isValidContactId) {
    return response.status(404).json({ message: "Not found" });
  }
  const isDeleteSuccess = await removeContactById(id, userId);

  if (isDeleteSuccess) {
    response.status(200).json({ message: "contact deleted" });
  } else {
    response.status(404).json({ message: "Not found" });
  }
};

const addContactController = async (request, response) => {
  const { _id: userId } = request.user;
  const newContactBody = request.body;
  const newContact = await addContact(newContactBody, userId);
  response.status(201).json(newContact);
};

const updateContactController = async (request, response) => {
  const newContactInfo = request.body;
  const { _id: userId } = request.user;

  if (Object.keys(newContactInfo).length === 0) {
    return response.status(400).json({ message: "missing fields" });
  }

  const id = request.params.contactId;
  const isValidContactId = isValidObjectId(id);

  if (!isValidContactId) {
    return response.status(404).json({ message: "Not found" });
  }
  const updatedContact = await updateContactById(id, newContactInfo, userId);

  if (updatedContact) {
    return response.status(200).json(updatedContact);
  } else {
    return response.status(404).json({ message: "Not found" });
  }
};

const updateStatusContactController = async (request, response) => {
  const newStatus = request.body;
  const id = request.params.contactId;
  const isValidContactId = isValidObjectId(id);
  const { _id: userId } = request.user;

  if (!isValidContactId) {
    return response.status(404).json({ message: "Not found" });
  }
  const updatedContact = await updateContactById(id, newStatus, userId);

  if (updatedContact) {
    return response.status(200).json(updatedContact);
  } else {
    return response.status(404).json({ message: "Not found" });
  }
};

module.exports = {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
};
