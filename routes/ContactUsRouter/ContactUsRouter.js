const express = require("express");
const router = express.Router();
const {
  addContactUs,
  getAllContactUs,
  getContactUsById,
  UpdateContactUs,
  DeleteContactUs,
} = require("../../controller/ContactUsController/ContactUsController");
const upload = require("../../middleware/eventMulter");

router.post("/addContactUs", upload, addContactUs);
router.get("/getAllContactUs", getAllContactUs);
router.get("/:id", getContactUsById);
router.delete("/:id", DeleteContactUs);
router.put("/:id", upload, UpdateContactUs);

module.exports = router;
