const express = require("express");
const router = express.Router();
const {
  createExpo,
  getAllExpo,
} = require("../../controller/formController/ConstructionExpoController");

router.post("/createExpoForm", createExpo);
router.get("/getallExpoForm", getAllExpo);

module.exports = router;
