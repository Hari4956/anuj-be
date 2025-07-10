const mongoose = require("mongoose");

const ConstructionExpoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const ConstructionExpo = mongoose.model(
  "ConstructionExpo",
  ConstructionExpoSchema
);
module.exports = ConstructionExpo;
