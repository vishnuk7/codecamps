const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const chalk = require("chalk");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/err");
const connectDB = require("./config/db");
//Route file
const codecampsRouter = require("./routes/codecamps");
const couresRouter = require("./routes/coures");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileUpload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//mount routers
app.use("/api/v1/codecamps", codecampsRouter);
app.use("/api/v1/coures", couresRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewsRouter);

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
