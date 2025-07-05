const express = require("express");
const router = express.Router();
const { CreateaddCard, getAllCards, deleteCardById, getCardsByDate } = require("../../controller/AddCardController/AddCardController");

router.post("/CreateaddCard", CreateaddCard);
router.get("/getCardsByDate", getCardsByDate);
router.get("/getAllCards", getAllCards);
router.delete("/:id", deleteCardById);

module.exports = router;