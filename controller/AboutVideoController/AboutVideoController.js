const AboutsVideo = require("../../models/AboutVideoModel/AboutVideo");

// Create (POST)
exports.addAboutVideo = async (req, res) => {
    try {
        const Video = new AboutsVideo(req.body);
        await Video.save();
        res.status(201).json({
            message: "Video added",
            Video: Video
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All
exports.getAboutVideo = async (req, res) => {
    try {
        const articles = await AboutsVideo.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete by ID
exports.deleteAboutVideo = async (req, res) => {
    try {
        const { id } = req.params;
        await AboutsVideo.findByIdAndDelete(id);
        res.json({ message: "Video Article deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
