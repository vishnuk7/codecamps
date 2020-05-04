const Course = require("../model/Coures");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");

//@desc Get all coures
//@route GET /api/v1/courses
//@route GET /api/v1/codecamps/:codecampsId/course
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.codecampsId) {
    query = Course.find({ bootcamp: req.params.codecampsId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const coures = await query;

  res.status(200).json({
    success: true,
    count: coures.length,
    data: coures,
  });
});

//@desc Get single course
//@route GET /api/v1/course
//@access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const coures = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!coures) {
    return next(
      new ErrorResponese(`No coures with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: coures,
  });
});
