const express = require("express");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createCourse)
  .get(getCourses);

router.route("/:id")
  .get(getCourseById)
  .put(updateCourse)
  .patch(updateCourse)
  .delete(deleteCourse);

module.exports = router;