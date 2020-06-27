const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please Enter the name"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please Enter the email"],
  },
  role: {
    type: String,
    required: [true, "Please add role"],
    enum: ["user", "publisher"],
  },
  password: {
    type: String,
    required: [true, "Please add password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
