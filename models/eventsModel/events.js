const mongoose = require("mongoose");

// Sub Content
const eventSchema = new mongoose.Schema({
  pictureHeading: { type: String, required: true },
  pictureDescription: { type: String, required: true },
  subImages: [String],
});

// Event Schema
const eventPageSchema = new mongoose.Schema(
  {
    mainHeading: { type: String, required: true },
    place: String,
    para: String,
    date: { type: String, required: true },
    filterEvent: String,
    tableOfContent: [String],
    subContents: [eventSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventPage", eventPageSchema);
