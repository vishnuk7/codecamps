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

const { protect } = require("../middleware/auth");

//Include other resource routers
const courseRouter = require("./coures");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advanceResult(Bootcamp, "courses"), getCodecamps)
  .post(protect, postCodecamp);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);
router
  .route("/:id")
  .get(getCodecamp)
  .put(protect, putCodecamp)
  .delete(protect, deleteCodecamp);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

//Re-route into other resource routers
router.use("/:codecampsId/courses", courseRouter);

module.exports = router;
