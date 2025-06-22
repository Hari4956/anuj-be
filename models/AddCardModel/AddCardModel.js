const mongoose = require("mongoose");

const addCardSchema = new mongoose.Schema({
    selectedProduct: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "TileProduct" },
            quantity: { type: Number, default: 1 }
        }
    ],
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
}, { timestamps: true })

const AddCard = mongoose.model("Add to Card", addCardSchema);
module.exports = AddCard;