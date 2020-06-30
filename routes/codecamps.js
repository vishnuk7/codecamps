const express = require("express");

const {
  getCodecamps,
  getCodecamp,
  postCodecamp,
  putCodecamp,
  deleteCodecamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

const Bootcamp = require("../model/Bootcamp");

const advanceResult = require("../middleware/advanceResult");

const { protect, authorize } = require("../middleware/auth");

//Include other resource routers
const courseRouter = require("./coures");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advanceResult(Bootcamp, "courses"), getCodecamps)
  .post(protect, authorize("publisher", "admin"), postCodecamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);
router
  .route("/:id")
  .get(getCodecamp)
  .put(protect, authorize("publisher", "admin"), putCodecamp)
  .delete(protect, authorize("publisher", "admin"), deleteCodecamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

//Re-route into other resource routers
router.use("/:codecampsId/courses", courseRouter);

module.exports = router;
