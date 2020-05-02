const fs = require("fs");
const mongoose = require("mongoose");
const chalk = require("chalk");
const dotenv = require("dotenv");
const path = require("path");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./model/Bootcamp");

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read JSON file
const boocamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Importing into DB
const importData = async () => {
  try {
    await Bootcamp.create(boocamps);
    console.log(chalk`{green Data Imported ...}`);
    process.exit();
  } catch (err) {
    console.log(chalk`{red ${err} }`);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log(chalk`{red Data deleted... }`);
    process.exit();
  } catch (err) {
    console.log(chalk`{red ${err}}`);
  }
};

if (process.argv[2] === "-import") {
  importData();
} else if (process.argv[2] === "-delete") {
  deleteData();
}
