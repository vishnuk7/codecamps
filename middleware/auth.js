const jwt = require("jsonwebtoken");
const aysncHandler = require("./asyncHandler");
const ErrorResponse = require("../util/errorResponse");
const User = require("../model/User");
const asyncHandler = require("./asyncHandler");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //   else if (req.headers.cookie) {
  //     token = req.cookie.token;
  //   }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }

  try {
    //verfiy token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode);
    req.user = await User.findById(decode.id);

    next();
  } catch (err) {
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log("not admin");
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized`, 403)
      );
    }
    console.log("admin");
    next();
  };
};
