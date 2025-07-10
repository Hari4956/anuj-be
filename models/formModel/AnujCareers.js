const mongoose = require("mongoose");

const AnujCareersSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    qualification: { type: String, required: true }, // Assuming resume is a string (e.g., file path or URL)
    phoneNumber: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

const AnujCareers = mongoose.model("AnujCareers", AnujCareersSchema);
module.exports = AnujCareers;
