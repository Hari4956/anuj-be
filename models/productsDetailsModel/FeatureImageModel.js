const mongoose = require("mongoose");

const featureImageSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  thumbnail: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FeatureImage", featureImageSchema);
