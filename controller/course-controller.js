const db = require("../models");

exports.getSemesters = (req, res) => {
  db.Course.distinct("semester").then((sem) => res.status(200).json(sem));
};

exports.getCourses = (req, res) => {
  db.Course.find({ semester: req.params.semno })
    .sort({ courseid: 1 })
    .then((courses) => res.status(200).json(courses));
};
