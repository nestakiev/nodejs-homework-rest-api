const { Contact } = require("../db/contactModel");

const getAllContacts = async (userId, favorite, skip, limit) => {
  if (favorite) {
    const favoritesContacts = await Contact.find(
      { owned: userId, favorite },
      "-__v",
      { skip, limit }
    );
    return favoritesContacts;
  }

  const contacts = await Contact.find({ owner: userId }, "-__v", {
    skip,
    limit,
  });
  return contacts;
};

const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, owner: userId }, "-__v");
  return contact;
};

const addContact = async (body, userId) => {
  const contact = new Contact({ ...body, owner: userId });
  const newContact = await contact.save();
  return newContact;
};

const removeContactById = async (id, userId) => {
  const removedContact = await Contact.findOneAndRemove({
    _id: id,
    owner: userId,
  });
  return removedContact;
};

const updateContactById = async (id, body, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { $set: body },
    { new: true }
  );
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
};
