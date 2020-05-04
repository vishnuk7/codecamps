const express = require("express");

const {
  getCodecamps,
  getCodecamp,
  postCodecamp,
  putCodecamp,
  deleteCodecamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamp");

//Include other resource routers
const courseRouter = require("./coures");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getCodecamps).post(postCodecamp);

router.route("/:id").get(getCodecamp).put(putCodecamp).delete(deleteCodecamp);

//Re-route into other resource routers
router.use("/:codecampsId/coures", courseRouter);

module.exports = router;
