const mongoose = require("mongoose");

const aboutVideoSchema = new mongoose.Schema({
    aboutVideo: { type: String, required: true },
});

const AboutVideo = mongoose.model("AboutVideo", aboutVideoSchema);
module.exports = AboutVideo;