const express = require("express");
const { getCourses } = require("../controllers/coures");

const router = express.Router();

router.route("/").get(getCourses);

module.exports = router;
