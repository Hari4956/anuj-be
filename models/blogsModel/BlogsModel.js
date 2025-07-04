const mongoose = require("mongoose");

const subContentSchema = new mongoose.Schema({
    pictureHeading: { type: String, required: true },
    pictureDescription: { type: String, required: true },
    subImages: [String],
});

const blogSchema = new mongoose.Schema({
    mainHeading: { type: String, required: true },
    place: String,
    para: String,
    date: { type: String, required: true },
    tableOfContent: [String],
    subContents: [subContentSchema],
}, { timestamps: true });

module.exports = mongoose.model("BlogPage", blogSchema);
