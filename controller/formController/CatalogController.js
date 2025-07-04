const path = require("path");
const fs = require("fs");
const Catalog = require("../../models/formModel/CatalogModel");

const addCatalog = async (req, res) => {
  try {
    const { fullName, phoneNumber, location } = req.body;
    const catalog = new Catalog({ fullName, phoneNumber, location });
    await catalog.save();

    const pdfPath = path.join(__dirname, "../../public/catalog.pdf");

    // Check if file exists before streaming
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=catalogue.pdf",
    });

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error.message); // helpful for debugging
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getCatalog = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { fromDate, toDate } = req.query;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    const skip = (page - 1) * limit;

    const matchStage = {};

    // Date Filter Logic
    if (fromDate || toDate) {
      const dateFilter = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include full day for 'toDate'
        dateFilter.$lte = to;
      }
      matchStage.createdAt = dateFilter;
    }

    const catalog = await Catalog.find(matchStage)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Catalog.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      message: "Catalog fetched successfully",
      data: catalog,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Catalog deleted successfully",
      data: catalog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { addCatalog, getCatalog, deleteCatalog };
