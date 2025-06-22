const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvent,
  getByEventId,
  deleteEvent,
  updateEvent,
} = require("../../controller/eventsController/events");
const upload = require("../../middleware/eventMulter");

router.post("/postEvent", upload, createEvent);
router.get("/getallEvent", getAllEvent);
router.get("/:id", getByEventId);
router.delete("/:id", upload, deleteEvent);
router.put("/:id", upload, updateEvent);

module.exports = router;
