const { Contact } = require("../db/contactModel");

const getAllContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

const addContact = async (body) => {
  const contact = new Contact(body);
  const newContact = await contact.save();
  return newContact;
};

const removeContactById = async (id) => {
  const removedContact = await Contact.findByIdAndRemove(id);
  return removedContact;
};

const updateContactById = async (id, body) => {
  await Contact.findByIdAndUpdate(id, { $set: body });
  const contact = await getContactById(id);
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
};
