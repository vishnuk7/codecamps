const chalk = require("chalk");
const ErrorResponese = require("../util/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  console.log(chalk`{red.bold ${err.stack}}`);

  //Mongoose bad object id
  if (err.name == "CastError") {
    const message = `Resource not found with id of ${req.params.id}`;
    error = new ErrorResponese(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Sever Error",
  });
};

module.exports = errorHandler;
