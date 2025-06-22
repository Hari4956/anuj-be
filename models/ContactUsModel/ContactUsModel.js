const mongoose = require("mongoose");

const ContactUs = new mongoose.Schema({
  shopImage: { type: String, required: true },
  shopName: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  openUtils: { type: String, required: true },
  email: { type: String, required: true },
});

const ContactUsModel = mongoose.model("ContactUs", ContactUs);
module.exports = ContactUsModel;
