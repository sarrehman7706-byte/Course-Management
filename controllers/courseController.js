const Course = require("../models/Course");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    typeof category !== "string" ||
    !category.trim()
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, valid non-negative price, and category ID are required",
    });
  }

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    return res.status(400).json({
      success: false,
      message: "The specified category does not exist",
    });
  }

  const course = await Course.create({
    title: title.trim(),
    description: description.trim(),
    price: Number(price),
    category,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("category", "name description")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body;
  const updates = {};

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Title cannot be empty",
    });
  }

  if (
    description !== undefined &&
    (typeof description !== "string" || !description.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Description cannot be empty",
    });
  }

  if (title !== undefined) updates.title = title.trim();

  if (description !== undefined) {
    updates.description = description.trim();
  }

  if (price !== undefined) {
    if (
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    updates.price = Number(price);
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid category ID is required",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "The specified category does not exist",
      });
    }

    updates.category = category;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate("category", "name description");

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};