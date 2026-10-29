const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createCategory)
  .get(getCategories);

router.route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;