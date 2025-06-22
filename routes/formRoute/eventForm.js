const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, updateEventById, deleteEventById } = require("../../controller/formController/evenForm");

router.post("/createEvenTForm", createEvent);
router.get("/getallEventForm", getAllEvents);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

module.exports = router;