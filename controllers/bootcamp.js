const ErrorResponese = require("../util/errorResponse");
const Bootcamp = require("../model/Bootcamp");

const asyncHandler = require("../middleware/asyncHandler");

//@desc Get all codecamps
//@route GET /api/v1/codecamps
//@access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

//@desc Get codecamp
//@route GET /api/v1/codecamps/:id
//@access Public
exports.getCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorResponese(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Create codecamps
//@route POST /api/v1/codecamps/:id
//@access Public
exports.postCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update codecamps
//@route PUT /api/v1/codecamps/:id
//@access Public
exports.putCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Delete codecamps
//@route DELETE /api/v1/codecamps/:id
//@access Public
exports.deleteCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
