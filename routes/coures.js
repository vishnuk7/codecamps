const express = require("express");
const { getCourses, getCourse } = require("../controllers/coures");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);
router.route("/:id").get(getCourse);

module.exports = router;
