const express = require("express");
const router = express.Router({ mergeParams: true });

const { getReviews, getReview, addReview } = require("../controllers/reviews");
const advanceResult = require("../middleware/advanceResult");
const Review = require("../model/Review");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advanceResult(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

router.route("/:id").get(getReview);

module.exports = router;
