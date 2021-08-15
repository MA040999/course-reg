const router = require("express").Router();
const controller = require("../controller");

router.get("/all", controller.Course.getSemesters);
router.get("/:semno", controller.Course.getCourses);

module.exports = router;
