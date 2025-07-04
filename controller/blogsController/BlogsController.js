const BlogPage = require("../../models/blogsModel/BlogsModel");

const createBlog = async (req, res) => {
  try {
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      place,
      para,
      date,
      tableOfContent,
      subContents,
    } = bodyFields;

    // Handle subImages
    const subImages = req.files?.subImages?.map((file) => file.path) || [];

    // Validate required fields
    if (!mainHeading || !place || !para || !date) {
      return res.status(400).json({
        success: false,
        error: "All main fields are required.",
      });
    }

    // Process subContents safely
    let processedSubContents = [];
    if (subContents) {
      try {
        const parsedSubContents =
          typeof subContents === "string"
            ? JSON.parse(subContents)
            : subContents;

        if (Array.isArray(parsedSubContents)) {
          // Validate each subContent has exactly the required 3 fields
          processedSubContents = parsedSubContents.map((subContent, index) => {
            if (!subContent.pictureHeading || !subContent.pictureDescription) {
              throw new Error(
                "Each subContent must have pictureHeading and pictureDescription"
              );
            }

            return {
              pictureHeading: subContent.pictureHeading,
              pictureDescription: subContent.pictureDescription,
              subImages: subImages[index] ? [subImages[index]] : [],
            };
          });
        } else {
          return res.status(400).json({
            success: false,
            error: "subContents must be an array",
          });
        }
      } catch (e) {
        console.error("Error parsing subContents:", e);
        return res.status(400).json({
          success: false,
          error: e.message || "Invalid subContents format",
        });
      }
    }

    // Process tableOfContent safely
    let parsedTableOfContent = [];
    if (tableOfContent) {
      try {
        parsedTableOfContent =
          typeof tableOfContent === "string"
            ? JSON.parse(tableOfContent)
            : tableOfContent;

        if (!Array.isArray(parsedTableOfContent)) {
          return res.status(400).json({
            success: false,
            error: "tableOfContent must be an array",
          });
        }
      } catch (e) {
        console.error("Error parsing tableOfContent:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid tableOfContent format",
        });
      }
    }

    // Create and save the new blog
    const newBlog = new BlogPage({
      mainHeading,
      place,
      para,
      date,
      tableOfContent: parsedTableOfContent,
      subContents: processedSubContents,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
      validationErrors: error.errors,
    });
  }
};

const getByBlogId = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogPage.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog not found",
      });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.log("error in get blog", error);
    res.status.json({
      success: false,
      message: "internal server error",
      details: error.message,
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchStage = {};

    if (from || to) {
      const dateFilter = {};
      if (from) dateFilter.$gte = from;
      if (to) {
        to.setHours(23, 59, 59, 999);
        dateFilter.$lte = to;
      }
      matchStage.createdAt = dateFilter;
    }

    const pipeline = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const blogs = await BlogPage.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

const deleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await BlogPage.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  let { mainHeading, place, para, date, tableOfContent, subContents } = req.body;

  try {
    const existingBlog = await BlogPage.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "blog not found" });
    }

    // Parse JSON strings if needed
    if (typeof subContents === "string") subContents = JSON.parse(subContents);
    if (typeof tableOfContent === "string") tableOfContent = JSON.parse(tableOfContent);

    const updatedSubContents = subContents.map((sub, index) => {
      const existingSub = existingBlog.subContents[index] || {};
      const uploadedImages = (req.files || [])
        .filter(file => file.fieldname === `subImages_${index}`)
        .map(file => file.path);

      return {
        ...existingSub,
        ...sub,
        subImages: uploadedImages.length > 0 ? uploadedImages : existingSub.subImages || [],
      };
    });

    // Update text fields
    existingBlog.mainHeading = mainHeading || existingBlog.mainHeading;
    existingBlog.place = place || existingBlog.place;
    existingBlog.para = para || existingBlog.para;
    existingBlog.date = date || existingBlog.date;
    existingBlog.tableOfContent = tableOfContent || existingBlog.tableOfContent;
    existingBlog.subContents = updatedSubContents;

    // Replace main image if uploaded
    const mainImgFile = (req.files || []).find(f => f.fieldname === "mainImage");
    if (mainImgFile) {
      existingBlog.mainImage = mainImgFile.path;
    }

    const updatedBlog = await existingBlog.save();

    res.status(200).json({
      message: "blog updated successfully",
      event: updatedBlog,
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBlog,
  getByBlogId,
  getAllBlogs,
  deleteBlogById,
  updateBlog,
};
