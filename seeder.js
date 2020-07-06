const fs = require("fs");
const mongoose = require("mongoose");
const chalk = require("chalk");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./model/Bootcamp");
const Course = require("./model/Coures");
const User = require("./model/User");
const Review = require("./model/Review");

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

const course = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const review = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Importing into DB
const importData = async () => {
  try {
    await Bootcamp.create(boocamps);
    await Course.create(course);
    await User.create(user);
    await Review.create(review);
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
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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
