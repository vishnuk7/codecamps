const mongoose = require("mongoose");
const chalk = require("chalk");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Pleas add a tution cost"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

//Static method to get avg of course tutions
CourseSchema.statics.getAvergeCost = async function (bootcampId) {
  console.log(chalk`{blue.inverse Calculating avg cost... }`);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
    console.log("updated");
  } catch (err) {
    console.log(err);
  }
};

//Call getAvergeCost after save
CourseSchema.post("save", function () {
  this.constructor.getAvergeCost(this.bootcamp);
});

//call getAvergeCost before remove
CourseSchema.pre("save", function () {
  this.constructor.getAvergeCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
