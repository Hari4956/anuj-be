const express = require("express");
const router = express.Router();
const {
  createCareers,
  getAllCareers,
} = require("../../controller/formController/AnujCareers");

router.post("/createCareersForm", createCareers);
router.get("/getallCareersForm", getAllCareers);

module.exports = router;
