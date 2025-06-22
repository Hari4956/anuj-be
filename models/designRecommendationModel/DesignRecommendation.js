const mongoose = require("mongoose");

const desigRecommendationSchema = new mongoose.Schema({
  roomImage: { type: String, required: true },
  tileType: { type: String, required: true },
  productId: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "TileProduct" },
      //   quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

const DesignRecommendation = mongoose.model("DesignRecommendation", desigRecommendationSchema);
module.exports = DesignRecommendation;