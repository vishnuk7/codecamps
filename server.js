const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const chalk = require("chalk");

const errorHandler = require("./middleware/err");
const connectDB = require("./config/db");
//Route file
const codecampsRouter = require("./routes/codecamps");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/codecamps", codecampsRouter);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    chalk`{yellow.bold.underline Server runing in ${process.env.NODE_ENV} mode on port ${PORT}}`
  )
);

//handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(chalk`{bgRed Error: ${err.message} }`);
  //close server & exit process
  server.close(() => process.exit(1));
});
