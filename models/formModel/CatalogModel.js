const mongoose = require("mongoose");

const CatalogSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const CatalogModel = mongoose.model("Catalog Download", CatalogSchema);
module.exports = CatalogModel;
