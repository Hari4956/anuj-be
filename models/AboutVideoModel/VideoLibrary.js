const mongoose = require("mongoose");

const VideoLibrarySchema = new mongoose.Schema({
  videoURl: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  minutes: { type: String, required: true },
});

const VideoLibrary = mongoose.model("VideoLibrary", VideoLibrarySchema);
module.exports = VideoLibrary;
