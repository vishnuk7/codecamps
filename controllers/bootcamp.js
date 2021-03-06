const path = require("path");
const ErrorResponese = require("../util/errorResponse");
const Bootcamp = require("../model/Bootcamp");

const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../util/geocoder");

//@desc Get all codecamps
//@route GET /api/v1/codecamps
//@access Public
exports.getCodecamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult);
});

//@desc Get codecamp
//@route GET /api/v1/codecamps/:id
//@access Public
exports.getCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponese(`Bootcamp not found with id of ${req.params.id}`, 404)
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
  //Only login user can add data into this
  //So add user id into body
  req.body.user = req.user.id;

  //Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponese(
        `The user with ID ${req.user.id} has already publised a bootcamp`
      ),
      400
    );
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id);

  //Make sure user is bootcamp owner
  if (Bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        40
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Delete codecamps
//@route DELETE /api/v1/codecamps/:id
//@access Public
exports.deleteCodecamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
    });
  }

  //Make sure user is bootcamp owner
  if (Bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp.remove();

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

//@desc upload photo for bootcamp
//@route PUT /api/v1/codecamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponese(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is bootcamp owner
  if (Bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponese(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponese(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure that user should only upload image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponese(`Please upload an image file`, 400));
  }

  //Check the file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponese(
        `Please upload an file ${process.env.MAX_FILE_UPLOAD} less this size`,
        400
      )
    );
  }

  //Create a custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  //Move the file into the server
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) {
      console.log(error);
      new ErrorResponese("file is not uploaded", 500);

      //Save the file name into database
      await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  });
});
