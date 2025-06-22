const express = require("express");
const router = express.Router();
const {
  createRequestCallback,getAllRequestCallbacks,updateRequestCallbackById,deleteRequestCallbackById} = require("../../controller/formController/requestCallback");

router.post("/createRequestCallback", createRequestCallback);
router.get("/getallRequestCallback", getAllRequestCallbacks);
router.put("/:id", updateRequestCallbackById);
router.delete("/:id", deleteRequestCallbackById);

module.exports = router;
