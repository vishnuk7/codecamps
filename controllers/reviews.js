const User = require("../model/User");
const Bootcamp = require("../model/Bootcamp");
const Review = require("../model/Review");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");

//@desc Get all reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = Review.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advanceResult);
  }
});

//@desc Get single review
//@route GET /api/v1/reviews/:id
//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponese(`No review found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc Add review
//@route POST /api/v1/codecamps/:codecampsId/reviews
//@access Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.codecampsId;
  req.body.user = req.user.id;

  const bootcamps = await Bootcamp.findById(req.params.codecampsId);

  if (!bootcamps) {
    return next(
      new ErrorResponese(
        `No bootcamps found with id of ${req.params.codecampsId}`,
        404
      )
    );
  }

  const review = Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});
