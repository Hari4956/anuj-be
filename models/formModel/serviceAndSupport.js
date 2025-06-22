const mongoose = require("mongoose");

const ServiceAndSupportSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
    voiceRecord: { type: String },
  },
  { timestamps: true }
);

const ServiceAndSupport = mongoose.model(
  "ServiceAndSupport",
  ServiceAndSupportSchema
);
module.exports = ServiceAndSupport;
