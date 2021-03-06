const chalk = require("chalk");
const ErrorResponese = require("../util/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  console.log(err);
  // console.log(chalk`{red.bold ${err.stack}}`);

  //Mongoose bad object id
  if (err.name == "CastError") {
    const message = `Resource not found with id of ${req.params.id}`;
    error = new ErrorResponese(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponese(message, 400);
  }

  //Mongoose validation code
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponese(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Sever Error",
  });
};

module.exports = errorHandler;
