const TileProduct = require("../../models/productsDetailsModel/productsDetails");
const mongoose = require("mongoose");

const createTileProduct = async (req, res) => {
  console.log(req.body);

  try {
    const filesArray = req.files?.images || [];

    if (filesArray.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // ✅ Process images array correctly
    const images = filesArray.map((file) => ({
      thumbnail: file.path,
      public_id: file.filename,
      url: file.secure_url || file.url,
    }));

    // ✅ Process applications
    let applications = [];
    if (req.body.applications) {
      applications = Array.isArray(req.body.applications)
        ? req.body.applications
        : req.body.applications.split(",").map((app) => app.trim());
    }

    // ✅ Parse details safely
    let details = {};
    try {
      details = req.body.details ? JSON.parse(req.body.details) : {};
    } catch (e) {
      console.warn("Failed to parse details:", e);
    }

    let size = {
      width: parseInt(req.body.width),
      height: parseInt(req.body.height),
      unit: "mm",
    };

    const trending =
      req.body.Trending === "Trending" || req.body.Trending === Trending;

    let featureImage = [];
    try {
      featureImage = req.body.featureImage
        ? JSON.parse(req.body.featureImage)
        : [];
    } catch (e) {
      console.warn("Failed to parse featureImage:", e);
    }
    const appliedimageUrl = req.files?.appliedimage?.[0]?.path || "";

    const product = new TileProduct({
      productID: req.body.productID,
      Type: req.body.Type,
      Trending: trending,
      name: req.body.name,
      series: req.body.series,
      size,
      availability: req.body.availability,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      details,
      applications,
      images,
      featureImage,
      PriceType: req.body.PriceType,
      description: req.body.description,
      productParticulars: req.body.productParticulars,
      appliedimage: appliedimageUrl,
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (err) {
    console.error("Error creating product:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: err.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

const getTileProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await TileProduct.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const getAllTileProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No product IDs provided.",
      });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const products = await TileProduct.find({ _id: { $in: objectIds } });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const filtergetProducts = async (req, res) => {
  const {
    material,
    color,
    finish,
    style,
    type,
    application,
    series,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    Trending,
    sortBy,
    size,
    page = 1,
    search,
  } = req.query;

  try {
    let pipeline = [];
    let matchStage = {};

    const parseFilter = (value) => {
      if (!value) return [];
      if (Array.isArray(value))
        return value.flatMap((v) => v.split(",")).map((item) => item.trim());
      return value.split(",").map((item) => item.trim());
    };

    const processFilter = (field, dbField, useRegex = false) => {
      const values = parseFilter(req.query[field]);
      if (values.length > 0) {
        if (useRegex) {
          matchStage[dbField] = {
            $in: values.map((val) => new RegExp(`^${val}$`, "i")), // exact match, case-insensitive
          };
        } else {
          matchStage[dbField] = { $in: values };
        }
      }
    };

    // Add text search if search query is provided
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search in name
        { productID: { $regex: search, $options: "i" } },
        { series: { $regex: search, $options: "i" } },
      ];
    }

    if (req.query.Type) {
      matchStage.Type = req.query.Type.trim();
    }
    processFilter("series", "series", true);
    processFilter("application", "applications", true);
    processFilter("material", "details.material");
    processFilter("color", "details.color");
    processFilter("finish", "details.finish");
    processFilter("style", "details.style");
    processFilter("type", "details.type");

    // Filter by size (e.g., 600x600)
    if (size) {
      const sizes = parseFilter(size);
      const sizeConditions = [];
      for (const sizeItem of sizes) {
        const cleanSize = String(sizeItem)
          .replace(/\s/g, "")
          .replace(/mm|cm|m/gi, "");
        const [width, height] = cleanSize.split("x").map(Number);
        if (!isNaN(width) && !isNaN(height)) {
          sizeConditions.push({
            $and: [{ "size.width": width }, { "size.height": height }],
          });
        }
      }
      if (sizeConditions.length > 0) {
        // If we already have $or from search, merge with size conditions
        if (matchStage.$or && !Array.isArray(matchStage.$or)) {
          matchStage.$or = [matchStage.$or, ...sizeConditions];
        } else if (matchStage.$or) {
          matchStage.$or.push(...sizeConditions);
        } else {
          matchStage.$or = sizeConditions;
        }
      }
    }

    // Rest of your existing code remains the same...
    // Filter by price range
    if (minPrice || maxPrice) {
      matchStage.originalPrice = {};
      if (minPrice) matchStage.originalPrice.$gte = Number(minPrice);
      if (maxPrice) matchStage.originalPrice.$lte = Number(maxPrice);
    }

    // Filter by discount range
    if (minDiscount || maxDiscount) {
      matchStage.discount = {};
      if (minDiscount) matchStage.discount.$gte = Number(minDiscount);
      if (maxDiscount) matchStage.discount.$lte = Number(maxDiscount);
    }

    // Filter by Trending
    if (Trending === "Trending") {
      matchStage.Trending = Trending;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add computed field for sizeString
    pipeline.push({
      $addFields: {
        sizeString: {
          $concat: [
            { $toString: "$size.width" },
            "x",
            { $toString: "$size.height" },
            "$size.unit",
          ],
        },
      },
    });

    // Sorting options
    const sortOptions = {
      priceHighToLow: { originalPrice: -1 },
      priceLowToHigh: { originalPrice: 1 },
      latest: { createdAt: -1 },
      discountHighToLow: { discount: -1 },
      discountLowToHigh: { discount: 1 },
      sizeAsc: { "size.width": 1, "size.height": 1 },
      sizeDesc: { "size.width": -1, "size.height": -1 },
    };

    if (sortBy && sortOptions[sortBy]) {
      pipeline.push({ $sort: sortOptions[sortBy] });
    }

    // Select fields to return
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        series: 1,
        size: 1,
        active: 1,
        availability: 1,
        originalPrice: 1,
        discount: 1,
        details: 1,
        applications: 1,
        Trending: 1,
        Type: 1,
        images: { thumbnail: 1 },
        sizeString: 1,
        createdAt: 1,
        productID: 1,
      },
    });

    const limit = 10;
    const skip = (page - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Clone pipeline to count total documents
    const countPipeline = [...pipeline];
    countPipeline.pop(); // remove limit
    countPipeline.pop(); // remove skip

    const totalCount = await TileProduct.aggregate([
      ...countPipeline,
      { $count: "totalCount" },
    ]);

    const totalRecords = totalCount[0] ? totalCount[0].totalCount : 0;
    const totalPages = Math.ceil(totalRecords / limit);

    const products = await TileProduct.aggregate(pipeline);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount: totalRecords,
      },
    });
  } catch (err) {
    console.error("Error in filtergetProducts:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const deleteTileProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await TileProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const ActiveProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Input validation
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    if (status !== "Active" && status !== "InActive") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    // Toggle status
    const updatedStatus = status === "Active" ? "InActive" : "Active";
    console.log(
      `Toggling product ${id} status from ${status} to ${updatedStatus}`
    );

    // Update product
    const updatedProduct = await TileProduct.findByIdAndUpdate(
      id,
      { active: updatedStatus },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: `Product status updated to ${updatedStatus} successfully`,
      data: updatedProduct,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }
    console.error(`Error updating product status:`, err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateTileProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("par", req.params);
    let product = await TileProduct.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.files["images"]) {
      const images = req.files["images"].map((file) => ({
        thumbnail: file.path,
        public_id: file.filename,
        url: file.secure_url || file.url,
      }));
      product.images = images;
    }

    if (req.files["featureImage"]) {
      const featureFile = req.files["featureImage"][0];
      product.featureImage = {
        thumbnail: featureFile.path,
        public_id: featureFile.filename,
        url: featureFile.secure_url || featureFile.url,
      };
    }

    // Update applications
    if (req.body.applications) {
      product.applications = Array.isArray(req.body.applications)
        ? req.body.applications
        : req.body.applications.split(",").map((app) => app.trim());
    }

    // Parse details safely
    if (req.body.details) {
      try {
        product.details = JSON.parse(req.body.details);
      } catch (e) {
        console.warn("Failed to parse details:", e);
      }
    }

    console.log(req.body.width, req.body.height);
    if (req.body.size) {
      try {
        const sizeObj = JSON.parse(req.body.size);
        const width = parseInt(sizeObj.width, 10);
        const height = parseInt(sizeObj.height, 10);

        if (!isNaN(width) && !isNaN(height)) {
          product.size = {
            width,
            height,
            unit: sizeObj.unit || "mm",
          };
        }
      } catch (e) {
        console.error("Failed to parse size:", e);
      }
    }

    // Update Trending (convert to Boolean)
    if (req.body.Trending !== undefined) {
      product.Trending =
        req.body.Trending === "true" || req.body.Trending === true;
    }

    if (req.body.featureImage) {
      try {
        if (Array.isArray(req.body.featureImage)) {
          product.featureImage = req.body.featureImage;
        } else {
          product.featureImage = JSON.parse(req.body.featureImage);
        }
      } catch (e) {
        console.warn("Failed to parse featureImage:", e);
      }
    }

    // Update other fields
    product.productID = req.body.productID || product.productID;
    product.Type = req.body.Type || product.Type;
    product.name = req.body.name || product.name;
    product.series = req.body.series || product.series;
    product.availability = req.body.availability || product.availability;
    product.originalPrice = req.body.originalPrice || product.originalPrice;
    product.discount = req.body.discount || product.discount;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("Error updating product:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: err.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

const updateMultipleProducts = async (req, res) => {
  try {
    console.log(req.body);
    const { ids, discount, status, Trending, Type } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No product IDs provided" });
    }

    // Prepare update object
    const updateFields = {};
    if (discount !== undefined) updateFields.discount = discount;
    if (status !== undefined && (status == "Active" || status == "InActive"))
      updateFields.active = status;
    if (
      status !== undefined &&
      (status == "Trending" || status == "Non Trending")
    )
      updateFields.Trending = status;
    if (
      status !== undefined &&
      (status == "Exclusive" || status == "Non Exclusive")
    )
      updateFields.Type = status;

    // Update all products
    const result = await TileProduct.updateMany(
      { _id: { $in: ids } },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} product(s) updated successfully`,
      data: result,
    });
  } catch (err) {
    console.error("Error updating products:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;
  console.log(query);
  if (!query || query.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Query parameter is required" });
  }

  try {
    const results = await TileProduct.find({
      $text: { $search: query },
    });

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createTileProduct,
  filtergetProducts,
  getAllTileProducts,
  deleteTileProductById,
  updateTileProduct,
  updateMultipleProducts,
  getTileProductById,
  ActiveProductById,
  searchProducts,
};
