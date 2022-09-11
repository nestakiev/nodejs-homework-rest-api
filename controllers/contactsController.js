const {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
} = require("../services/contactsService");

const { Contact } = require("../db/contactModel");

const listContactsController = async (request, response) => {
  const contacts = await getAllContacts();
  response.status(200).json(contacts);
};

const getContactByIdController = async (request, response) => {
  console.log(request.params);
  const id = request.params.contactId;
  if (id.length !== 24) {
    return response.status(404).json({ message: "Not found" });
  }

  const contactById = await getContactById(id);

  if (!contactById) {
    return response.status(404).json({ message: "Not found" });
  }

  response.status(200).json(contactById);
};

const removeContactController = async (request, response) => {
  const id = request.params.contactId;
  if (id.length !== 24) {
    return response.status(404).json({ message: "Not found" });
  }
  const isDeleteSuccess = await removeContactById(id);

  if (isDeleteSuccess) {
    response.status(200).json({ message: "contact deleted" });
  } else {
    response.status(404).json({ message: "Not found" });
  }
};

const addContactController = async (request, response) => {
  const newContactBody = request.body;
  const newContact = await addContact(newContactBody);
  response.status(201).json(newContact);
};

const updateContactController = async (request, response) => {
  const newContactInfo = request.body;
  if (Object.keys(newContactInfo).length === 0) {
    return response.status(400).json({ message: "missing fields" });
  }

  const id = request.params.contactId;
  if (id.length !== 24) {
    return response.status(404).json({ message: "Not found" });
  }
  const updatedContact = await updateContactById(id, newContactInfo);

  if (updatedContact) {
    return response.status(200).json(updatedContact);
  } else {
    return response.status(404).json({ message: "Not found" });
  }
};

const updateStatusContactController = async (request, response) => {
  const newStatus = request.body;
  const id = request.params.contactId;
  if (id.length !== 24) {
    return response.status(404).json({ message: "Not found" });
  }
  const updatedContact = await updateContactById(id, newStatus);

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
  updateStatusContactController
};
