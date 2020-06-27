const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");
const User = require("../model/User");

//@desc Resgiter User
//@route POST /api/v1/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token: token });
});

//@desc Login User
//@route POST /api/v1/register
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate username and password
  if (!email && !password) {
    return next(
      new ErrorResponese(`Please provide email and password for login `, 400)
    );
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password"); //({email:  email})

  if (!user) {
    return next(
      new ErrorResponese(`Please enter correct email or password `, 401)
    );
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponese(`Please enter correct email or password `, 401)
    );
  }

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});
