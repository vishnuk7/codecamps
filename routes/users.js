const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const advanceResult = require("../middleware/advanceResult");
const User = require("../model/User");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advanceResult(User), getUser).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
