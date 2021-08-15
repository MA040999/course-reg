const router = require("express").Router();
const controller = require("../controller");

router.post("/add", controller.Registration.addRegistration);
router.get("/:regno", controller.Registration.showRegistration);
router.get("/gpa/:regno", controller.Registration.getUpdatedGPA);
router.patch("/update", controller.Registration.updateRegistration);

module.exports = router;
