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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send message
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//@desc Get current logged in user
//@route GET /api/v1/auth/me
//@access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
