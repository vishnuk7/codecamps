const crypto = require("crypto");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponese = require("../util/errorResponse");
const User = require("../model/User");
const sendEmail = require("../util/sendEmail");
const { resolveSoa } = require("dns");

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

//@desc Forgot password
//@route GET /api/v1/auth/forgotpassword
//@access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponese(`There is no user with that email`, 404));
  }

  //Get Reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Passsword reset",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponese(`Email could not sent`, 500));
  }
});

//@desc Reset password
//@route GET /api/v1/auth/resetpassword/:resettoken
//@access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  //Get hashed password
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponese(`Invalid token`));
  }

  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
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
