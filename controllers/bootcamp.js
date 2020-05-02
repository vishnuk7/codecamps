const ErrorResponese = require("../util/errorResponse");
const Bootcamp = require("../model/Bootcamp");

const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../util/geocoder");

//@desc Get all codecamps
//@route GET /api/v1/codecamps
//@access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const copyQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete copyQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(copyQuery);

  //Create operators ($gt,$lte,$lt)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  
  //Executing resource
  const bootcamp = await query;

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
//@route POST /api/v1/codecamps/
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

//@desc Get bootcamps within a radius
//@route DELETE /api/v1/codecamps/radius/:zipcode/:distance
//@access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng fron geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide dist by radius of Earth
  //Earth Radius = 3,963 mi / 6,378km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
