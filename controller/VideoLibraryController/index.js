const VideoLibrary = require("../../models/AboutVideoModel/VideoLibrary");

const AddVideoController = async (req, res) => {
  try {
    const { videoURl, title, date, minutes } = req.body;
    console.log("Received data for adding video:", req.body);

    if (!videoURl || !title || !date || !minutes) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newVideo = new VideoLibrary({
      videoURl,
      title,
      date,
      minutes,
    });

    await newVideo.save();
    res.status(201).json({ message: "Video added successfully", newVideo });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVideosController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive numbers" });
    }

    const skip = (page - 1) * limit;

    const videos = await VideoLibrary.find()
      .sort({ createdAt: -1 }) // Sort by creation date, most recent first
      .skip(skip)
      .limit(limit);

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }

    const totalVideos = await VideoLibrary.countDocuments();

    res.status(200).json({
      message: "Videos fetched successfully",
      videos,
      totalVideos,
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit),
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateVideoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoURl, title, date, minutes } = req.body;

    if (!videoURl || !title || !date || !minutes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedVideo = await VideoLibrary.findByIdAndUpdate(
      id,
      { videoURl, title, date, minutes },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res
      .status(200)
      .json({ message: "Video updated successfully", updatedVideo });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteVideoController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await VideoLibrary.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  AddVideoController,
  getAllVideosController,
  UpdateVideoController,
  DeleteVideoController,
};
