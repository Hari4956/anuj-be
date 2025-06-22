const express = require("express");
const router = express.Router();
const {
    addBanner,
    getBanner,
    UpdateBanner,
    deletebanner
} = require("../../controller/BannerController/BannerController");
const upload = require("../../middleware/multer");

router.post("/addBanner", upload.single("bannerImage"), addBanner);
router.get("/getallbanner", getBanner);
router.put("/updatebanner", upload.single("bannerImage"), UpdateBanner);
router.delete("/:id", deletebanner);

module.exports = router;
