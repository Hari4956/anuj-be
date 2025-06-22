const BlogPage = require("../../models/blogsModel/BlogsModel");

const createBlog = async (req, res) => {
  try {
    // Trim whitespace from field names
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      title,
      para,
      date,
      time,
      tableOfContent,
      subContents,
    } = bodyFields;

    // Handle mainImage
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    // Handle subImages
    const subImages = req.files?.subImages?.map((file) => file.path) || [];

    if (!mainImage) {
      return res.status(400).json({
        success: false,
        error: "Main image is required.",
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
          processedSubContents = parsedSubContents.map((subContent, index) => {
            const imagesForContent = subImages[index] ? [subImages[index]] : [];

            return {
              ...subContent,
              subImages: imagesForContent,
            };
          });
        } else {
          console.error("subContents is not an array");
        }
      } catch (e) {
        console.error("Error parsing subContents:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid subContents format",
        });
      }
    }

    // Process tableOfContent safely
    let parsedTableOfContent = [];
    if (tableOfContent) {
      try {
        parsedTableOfContent = JSON.parse(tableOfContent);
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
      mainImage,
      title,
      para,
      date,
      time,
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
    const blogs = await BlogPage.find();
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
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Request body is missing.",
      });
    }

    // Trim all field names in the request body
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      title,
      para,
      date,
      time,
      tableOfContent,
      subContents,
    } = bodyFields;

    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const subImages = req.files?.subImages?.map((file) => file.path) || [];

    // Check if the blog exists
    const existingBlog = await BlogPage.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found.",
      });
    }

    // Update only provided fields
    if (mainHeading !== undefined) existingBlog.mainHeading = mainHeading;
    if (title !== undefined) existingBlog.title = title;
    if (para !== undefined) existingBlog.para = para;
    if (date !== undefined) existingBlog.date = date;
    if (time !== undefined) existingBlog.time = time;
    if (mainImage) existingBlog.mainImage = mainImage;

    // Process tableOfContent
    let parsedTableOfContent = existingBlog.tableOfContent;
    if (tableOfContent !== undefined) {
      try {
        parsedTableOfContent =
          typeof tableOfContent === "string"
            ? JSON.parse(tableOfContent)
            : tableOfContent;

        if (!Array.isArray(parsedTableOfContent)) {
          throw new Error("tableOfContent must be an array.");
        }

        existingBlog.tableOfContent = parsedTableOfContent;
      } catch (e) {
        console.error("Error parsing tableOfContent:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid tableOfContent format.",
        });
      }
    }

    // Process subContents
    if (subContents !== undefined) {
      try {
        const parsedSubContents =
          typeof subContents === "string"
            ? JSON.parse(subContents)
            : subContents;

        if (!Array.isArray(parsedSubContents)) {
          throw new Error("subContents must be an array.");
        }

        // Length validation
        if (parsedTableOfContent.length !== parsedSubContents.length) {
          return res.status(400).json({
            success: false,
            error: `Length of subContents (${parsedSubContents.length}) must match length of tableOfContent (${parsedTableOfContent.length}).`,
          });
        }

        const updatedSubContents = existingBlog.subContents.map(
          (existingSubContent, index) => {
            const incomingSubContent = parsedSubContents[index];
            const subContentImages = subImages[index]
              ? [subImages[index]]
              : existingSubContent.subImages;

            if (!incomingSubContent) return existingSubContent;

            return {
              ...existingSubContent,
              ...incomingSubContent,
              subImages: subContentImages.length
                ? subContentImages
                : existingSubContent.subImages,
            };
          }
        );

        // Add new subContents if any
        if (parsedSubContents.length > existingBlog.subContents.length) {
          const additionalSubContents = parsedSubContents
            .slice(existingBlog.subContents.length)
            .map((subContent, index) => ({
              ...subContent,
              subImages: subImages[existingBlog.subContents.length + index]
                ? [subImages[existingBlog.subContents.length + index]]
                : [],
            }));

          updatedSubContents.push(...additionalSubContents);
        }

        existingBlog.subContents = updatedSubContents;
      } catch (e) {
        console.error("Error parsing subContents:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid subContents format.",
        });
      }
    }

    // Save the updated blog
    const updatedBlog = await existingBlog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getByBlogId,
  getAllBlogs,
  deleteBlogById,
  updateBlog,
};
