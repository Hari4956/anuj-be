const express = require("express");
const router = express.Router();
const { addQuote, getQuotes, deleteQuote, getQuotesByDate } = require("../../controller/GetQuoteController/GetQuoteController");

router.post("/addQuote", addQuote);
router.get("/getallQuote", getQuotes);
router.get("/getQuotesByDate", getQuotesByDate);
router.delete("/:id", deleteQuote);

module.exports = router;