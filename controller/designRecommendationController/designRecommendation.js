const DesignRecommendation = require("../../models/designRecommendationModel/DesignRecommendation");

const createDesignRecommendation = async (req, res) => {
  try {
    // multer saves uploaded file info here
    const roomImage = req.file ? req.file.path : null;
    const { tileType } = req.body;
    const productIdRaw = req.body.productId;

    let productId;
    try {
      productId = JSON.parse(productIdRaw);
    } catch (e) {
      return res
        .status(400)
        .json({ error: "productId must be a valid JSON array" });
    }

    // Validate inputs
    if (!roomImage || !tileType || !Array.isArray(productId) || productId.length === 0) {
      return res
        .status(400)
        .json({ error: "roomImage and productId are required" });
    }

    // Create new DesignRecommendation document
    const newRecommendation = new DesignRecommendation({
      roomImage,
      tileType,
      productId,
    });

    // Save to database
    const savedRecommendation = await newRecommendation.save();

    // Respond success
    res.status(201).json(savedRecommendation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDesignRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await DesignRecommendation.findById(id).populate(
      "productId.product"
    );

    if (!recommendation) {
      return res.status(404).json({ error: "DesignRecommendation not found" });
    }

    res.status(200).json(recommendation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDesignRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete by ID
    const deleted = await DesignRecommendation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "DesignRecommendation not found" });
    }

    res
      .status(200)
      .json({ message: "DesignRecommendation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDesignRecommendations = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 8;
    const skip = (page - 1) * limit;

    // Match stage for filtering
    const matchStage = {};

    if (fromDate || toDate) {
      const dateFilter = {};

      if (fromDate) {
        dateFilter.$gte = new Date(fromDate);
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // ✅ Include full toDate
        dateFilter.$lte = to;
      }

      matchStage.createdAt = dateFilter;
    }

    const pipeline = [];

    // Apply filter if matchStage exists
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "tileproducts",
          localField: "productId.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $project: {
          roomImage: 1,
          createdAt: 1,
          productId: 1,
          productDetails: 1
        }
      }
    );

    // Fetch data and total count
    const [recommendations, totalCount] = await Promise.all([
      DesignRecommendation.aggregate(pipeline),
      DesignRecommendation.countDocuments(matchStage)
    ]);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      data: recommendations
    });
  } catch (err) {
    console.error("Error fetching design recommendations:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateDesignRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRoomImage = req.file ? req.file.path : null;

    let updatedProductId = [];
    if (req.body.productId) {
      try {
        updatedProductId = JSON.parse(req.body.productId);
        if (!Array.isArray(updatedProductId)) {
          return res.status(400).json({ error: "productId must be an array" });
        }
      } catch (e) {
        return res.status(400).json({ error: "Invalid productId JSON format" });
      }
    }

    const updateData = {};
    if (updatedRoomImage) updateData.roomImage = updatedRoomImage;
    if (updatedProductId.length > 0) updateData.productId = updatedProductId;

    if (req.body.tileType && typeof req.body.tileType === 'string') {
      updateData.tileType = req.body.tileType;
    }

    const updated = await DesignRecommendation.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "DesignRecommendation not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDesignRecommendation,
  deleteDesignRecommendationById,
  getDesignRecommendations,
  updateDesignRecommendationById,
  getDesignRecommendationById,
};
