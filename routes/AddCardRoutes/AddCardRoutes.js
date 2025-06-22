const express = require("express");
const router = express.Router();
const { CreateaddCard, getAllCards, deleteCardById } = require("../../controller/AddCardController/AddCardController");

router.post("/CreateaddCard", CreateaddCard);
router.get("/getAllCards", getAllCards);
router.delete("/:id", deleteCardById);

module.exports = router;