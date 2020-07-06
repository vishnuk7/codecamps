const express = require("express");
const router = express.Router({ mergeParams: true });

const { getReviews, getReview } = require("../controllers/reviews");
const advanceResult = require("../middleware/advanceResult");
const Review = require("../model/Review");

router.route("/").get(
  advanceResult(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

router.route("/:id").get(getReview);

module.exports = router;
