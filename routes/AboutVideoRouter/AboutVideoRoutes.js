const express = require("express");
const router = express.Router();
const {
    addAboutVideo,
    getAboutVideo,
    deleteAboutVideo,
} = require("../../controller/AboutVideoController/AboutVideoController");

router.post("/addAboutVideo", addAboutVideo);
router.get("/getAboutVideo", getAboutVideo);
router.delete("/:id", deleteAboutVideo);

module.exports = router;