const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");
const imageController = require("../../controller/productsDetailsController/FeatureImages");

router.post(
  "/upload",
  upload.array("featureImage", 8),
  imageController.uploadFeatureImages
);

router.get("/getFeatureAll", imageController.getAllImages);

router.get("/:id", imageController.getImageById);

module.exports = router;
