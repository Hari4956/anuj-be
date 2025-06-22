const FeatureImage = require("../../models/productsDetailsModel/FeatureImageModel");

exports.uploadFeatureImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // ensure names is an array
    const names = Array.isArray(req.body.names)
      ? req.body.names
      : [req.body.names];

    const images = req.files.map((file, index) => ({
      thumbnail: file.path,
      Name: names[index] || "Untitled", // if name missing
    }));

    const savedImages = await FeatureImage.insertMany(images);
    res.json({ success: true, images: savedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const images = await FeatureImage.find();
    res.json({
      success: true,
      images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const image = await FeatureImage.findById(req.params.id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    res.json({
      success: true,
      image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
