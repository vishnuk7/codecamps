const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");
const User = require("../model/User");

//@desc Resgiter User
//@route GET /api/v1/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(200).json({ success: true });
});
