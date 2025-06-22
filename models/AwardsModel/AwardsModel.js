const mongoose = require("mongoose");

const AwardsSchema = new mongoose.Schema({
    awardsImage: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
});

const Awards = mongoose.model("Awards", AwardsSchema);
module.exports = Awards;