const express = require("express");
const router = express.Router();
const {
  DeleteVideoController,
  UpdateVideoController,
  getAllVideosController,
  AddVideoController,
} = require("../../controller/VideoLibraryController/index");
const { route } = require("../Auth/UserRouter");

router.post("/addVideo", AddVideoController);
router.get("/getAllVideos", getAllVideosController);
router.put("/:id", UpdateVideoController);
router.delete("/:id", DeleteVideoController);

module.exports = router;
