const mongoose = require("mongoose");

const getQuoteSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TileProduct'
    },
    quantity: { type: String, required: true },
}, { timestamps: true });

const GetQuote = mongoose.model("GetQuote", getQuoteSchema);
module.exports = GetQuote;