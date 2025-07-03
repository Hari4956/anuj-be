const mongoose = require("mongoose");

const TalkSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
}, { timestamps: true });

const Talk = mongoose.model("Talk with specialist", TalkSchema);
module.exports = Talk;