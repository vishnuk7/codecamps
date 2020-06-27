const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coures");

const Coures = require("../model/Coures");
const advanceResult = require("../middleware/advanceResult");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advanceResult(Coures, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
