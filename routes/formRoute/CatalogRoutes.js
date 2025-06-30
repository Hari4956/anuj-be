const express = require("express");
const router = express.Router();
const {
  addCatalog,
  getCatalog,
  deleteCatalog,
} = require("../../controller/formController/CatalogController");

router.post("/addCatalog", addCatalog);
router.get("/getCatalog", getCatalog);
router.delete("/:id", deleteCatalog);

module.exports = router;
