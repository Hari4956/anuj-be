const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

const Event = mongoose.model("EventForm", EventSchema);
module.exports = Event;
