const express = require("express");
const { AddAwards,
    getAllAwards,
    getAwardsById,
    updateAwards,
    deleteAwards
} = require("../../controller/AwardsController/AwardsController");
const router = express.Router();
const upload = require("../../middleware/multer");

router.post("/addawards", upload.single("awardsImage"), AddAwards);
router.get("/getallawards", getAllAwards);
router.put("/:id", upload.single("awardsImage"), updateAwards);
router.get("/:id", getAwardsById);
router.delete("/:id", deleteAwards);
module.exports = router