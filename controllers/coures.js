const Course = require("../model/Coures");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");

//@desc Get all codecamps
//@route GET /api/v1/courses
//@route GET /api/v1/codecamps/:codecampsId/course
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.codecampsId) {
    query = Course.find({ bootcamps: req.params.bootcamps });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const coures = await query;

  res.status(200).json({
    success: true,
    count: Course.length,
    data: coures,
  });
});
