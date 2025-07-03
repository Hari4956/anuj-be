const express = require("express");
const router = express.Router();
const {
    addTalkSpecialist,
    getAllTalkSpecialist,
    deleteTalkSpecialist
} = require("../../controller/formController/TalkSpecialist");

router.post("/addTalkSpecialist", addTalkSpecialist);
router.get("/getTalkSpecialist", getAllTalkSpecialist);
router.delete("/:id", deleteTalkSpecialist);

module.exports = router;