const express = require("express");
const router = express.Router();
const { addQuote, getQuotes, deleteQuote } = require("../../controller/GetQuoteController/GetQuoteController");

router.post("/addQuote", addQuote);
router.get("/getallQuote", getQuotes);
router.delete("/:id", deleteQuote);

module.exports = router;