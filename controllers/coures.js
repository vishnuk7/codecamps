const Course = require("../model/Coures");
const Bootcamp = require("../model/Bootcamp");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");

//@desc Get all coures
//@route GET /api/v1/courses
//@route GET /api/v1/codecamps/:codecampsId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.codecampsId) {
    const courses = Course.find({ bootcamp: req.params.codecampsId });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advanceResult);
  }
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

//@desc Add a course
//@route POST /api/v1/codecamps/:codecampsId/courses
//@access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  //adding bootcamp property into body object with the value codecampsId
  req.body.bootcamp = req.params.codecampsId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.codecampsId);

  if (!bootcamp) {
    return next(
      new ErrorResponese(`No bootcamp found with this id of ${req.params.id}`),
      404
    );
  }

  //Make sure user is bootcamp owner
  if (Bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.user.id} is not authorized to add course to bootcamp ${bootcamp._id} `,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc Update a course
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponese(`No course with the id of ${req.params.id}`),
      400
    );
  }

  //Make sure user is course owner
  if (course.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.user.id} is not authorized to update course ${course._id} `,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc Delete a course
//@route Delete /api/v1/courses/:id
//@access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponese(`No course with the id of ${req.params.id}`),
      400
    );
  }

  //Make sure user is course owner
  if (course.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.user.id} is not authorized to delete course ${course._id} `,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
