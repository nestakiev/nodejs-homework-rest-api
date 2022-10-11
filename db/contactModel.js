const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = {
  Contact,
};
