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

//Re-route into other resource routers
router.use("/:codecampsId/coures", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getCodecamps).post(postCodecamp);

router.route("/:id").get(getCodecamp).put(putCodecamp).delete(deleteCodecamp);

module.exports = router;
