const express = require("express");
const router = express.Router();
const {
  createDesignRecommendation,
  deleteDesignRecommendationById,
  getDesignRecommendations,
  updateDesignRecommendationById,
  getDesignRecommendationById,
} = require("../../controller/designRecommendationController/designRecommendation");
const upload = require("../../middleware/designRecommendation");

router.post("/postDesignRecommendation", upload, createDesignRecommendation);
router.get("/getDesignRecommendations", getDesignRecommendations);
router.get("/:id", getDesignRecommendationById);
router.delete("/:id", deleteDesignRecommendationById);
router.put("/:id", upload, updateDesignRecommendationById);

module.exports = router;
