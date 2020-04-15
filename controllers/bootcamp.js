const Bootcamp = require("../model/Bootcamp");

//@desc Get all codecamps
//@route GET /api/v1/codecamps
//@access Public
exports.getCodecamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show all bootcamps` });
};

//@desc Get codecamp
//@route GET /api/v1/codecamps/:id
//@access Public
exports.getCodecamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

//@desc Create codecamps
//@route POST /api/v1/codecamps/:id
//@access Public
exports.postCodecamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
};

//@desc Update codecamps
//@route PUT /api/v1/codecamps/:id
//@access Public
exports.putCodecamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

//@desc Delete codecamps
//@route DELETE /api/v1/codecamps/:id
//@access Public
exports.deleteCodecamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
