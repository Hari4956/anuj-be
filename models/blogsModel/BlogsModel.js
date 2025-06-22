const mongoose = require("mongoose");

// Sub Content Schema (array of strings for pictureHeading, subHeading, pictureDescription, subImages)
const subContentSchema = new mongoose.Schema({
    pictureHeading: [String],     
    subHeading: [String],      
    pictureDescription: [String], 
    subImages: [String]           
});

// Blog Schema
const blogSchema = new mongoose.Schema({
    mainHeading: { type: String, required: true },
    mainImage: { type: String, required: true },
    title: { type: String, required: true },
    date: String,
    time: String,
    para: String,
    tableOfContent: [String],
    subContents: [subContentSchema],
    
}, { timestamps: true });

module.exports = mongoose.model("BlogPage", blogSchema);
