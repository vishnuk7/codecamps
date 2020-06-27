const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");
const User = require("../model/User");

//@desc Resgiter User
//@route GET /api/v1/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
