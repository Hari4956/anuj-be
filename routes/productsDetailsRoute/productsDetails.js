const express = require("express");
const router = express.Router();
const {
  createTileProduct,
  getAllTileProducts,
  ActiveProductById,
} = require("../../controller/productsDetailsController/productsDetails");
const upload = require("../../middleware/multer");
const {
  filtergetProducts,
  getTileProductById,
  deleteTileProductById,
  updateTileProduct,
  updateMultipleProducts,
} = require("../../controller/productsDetailsController/productsDetails");

router.post(
  "/postTileDetails",
  upload.fields([
    { name: "featureImage", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "appliedimage", maxCount: 5 },
  ]),
  createTileProduct
);

router.get("/filtergetproducts", filtergetProducts);
// router.put(
//   "/update-multiple/:id",
//   upload.fields([{ name: "images", maxCount: 10 }]),
//   updateTileProduct
// );
router.post("/getallproducts", getAllTileProducts);
router.put("/updateMultiple", updateMultipleProducts);
router.put("/active-product/:id", ActiveProductById);
router.put(
  "/:id",
  upload.fields([
    { name: "images" },
    { name: "appliedimage", maxCount: 1 },
    { name: "featureImage" },
  ]),
  updateTileProduct
);
router.get("/getproduct/:id", getTileProductById);
router.delete("/:id", deleteTileProductById);

module.exports = router;
