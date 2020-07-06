const express = require("express");
const router = express.Router({ mergeParams: true });

const { getReviews } = require("../controllers/reviews");
const advanceResult = require("../middleware/advanceResult");
const Review = require("../model/Review");

router.route("/").get(
  advanceResult(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

module.exports = router;
