const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    bannerImage: { type: String, required: true },
    page: { type: String, required: true },
});

const Banner = mongoose.model("Banners", bannerSchema);
module.exports = Banner;