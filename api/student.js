const router = require("express").Router();
const controller = require("../controller");

router.get("/:regno", controller.Student.getStudentByID);

module.exports = router;
