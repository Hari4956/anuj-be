const mongoose = require("mongoose");

const tileProductSchema = new mongoose.Schema(
  {
    productID: { type: String, required: true },
    Type: { type: String, default: "Non Exclusive" }, //exclusive
    Trending: { type: String, default: "Non Trending" },
    name: { type: String, required: true },
    series: { type: String },
    active: { type: String, default: "Active" },
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    pieces: { type: Number, default: 0 },
    sqf: { type: Number, default: 0 },
    availability: { type: String },
    originalPrice: { type: Number },
    discount: { type: Number },
    details: {
      material: { type: String },
      finish: { type: String },
      color: { type: String },
      type: { type: String },
      style: { type: String },
    },
    applications: [{ type: String }],
    images: [
      {
        thumbnail: { type: String },
      },
    ],
    featureImage: [{ type: String }],
    appliedimage: [
      {
        thumbnail: { type: String },
        public_id: { type: String },
        url: { type: String },
      },
    ],
    description: { type: String },
    productParticulars: { type: String },
  },

  {
    timestamps: true,
  }
);

tileProductSchema.index({ name: "text" });

const TileProduct = mongoose.model("TileProduct", tileProductSchema);

module.exports = TileProduct;
