const mongoose = require("mongoose");

// Sub Content 
const eventSchema = new mongoose.Schema({
    pictureHeading: [String],
    pictureDescription: [String],
    subImages: [String]
});

// Event Schema
const eventPageSchema = new mongoose.Schema({
    mainHeading: { type: String, required: true },
    mainImage: { type: String, required: true },
    place: String,
    para: String,
    date: { type: String, required: true },
    event: { type: String, required: true },
    tableOfContent: [String],
    subContents: [eventSchema],

}, { timestamps: true });

module.exports = mongoose.model("EventPage", eventPageSchema);
