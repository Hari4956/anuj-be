const express = require("express");
const router = express.Router();
const {
  createBlog,
  getByBlogId,
  getAllBlogs,
  deleteBlogById,
  updateBlog,
} = require("../../controller/blogsController/BlogsController");
const upload = require("../../middleware/blogMulter");

router.post("/createblog", upload, createBlog);
router.get("/getallblog", getAllBlogs);
router.get("/:id", getByBlogId);
router.put("/:id", upload, updateBlog);
router.delete("/:id", deleteBlogById);

module.exports = router;
