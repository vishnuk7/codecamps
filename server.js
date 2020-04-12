const express = require("express");
const dotenv = require("dotenv");

const logger = require("./middleware/logger");

//Route file
const codecampsRouter = require("./routes/codecamps");

//load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

//calling logger
app.use(logger);

//mount routers
app.use("/api/v1/codecamps", codecampsRouter);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
