const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Category name and description are required",
    });
  }

  const category = await Category.create({
    name: name.trim(),
    description: description.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (
    (name !== undefined &&
      (typeof name !== "string" || !name.trim())) ||
    (description !== undefined &&
      (typeof description !== "string" || !description.trim()))
  ) {
    return res.status(400).json({
      success: false,
      message: "Provided category fields cannot be empty",
    });
  }

  const updates = {};

  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) {
    updates.description = description.trim();
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};