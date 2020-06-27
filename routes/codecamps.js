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

//Include other resource routers
const courseRouter = require("./coures");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advanceResult(Bootcamp, "courses"), getCodecamps)
  .post(postCodecamp);

router.route("/:id").get(getCodecamp).put(putCodecamp).delete(deleteCodecamp);

router.route("/:id/photo").put(bootcampPhotoUpload);

//Re-route into other resource routers
router.use("/:codecampsId/courses", courseRouter);

module.exports = router;
