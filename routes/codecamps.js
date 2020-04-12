const express = require("express");

const {
  getCodecamps,
  getCodecamp,
  postCodecamp,
  putCodecamp,
  deleteCodecamp,
} = require("../controllers/bootcamp");

const router = express.Router();

router.route("/").get(getCodecamps).post(postCodecamp);

router.route("/:id").get(getCodecamp).put(putCodecamp).delete(deleteCodecamp);

module.exports = router;
