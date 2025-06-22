const mongoose = require("mongoose");

const requestCallbackSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

const RequestCallback = mongoose.model("RequestCallback", requestCallbackSchema);
module.exports = RequestCallback;
