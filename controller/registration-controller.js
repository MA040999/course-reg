const db = require("../models");
const Registration = require("../models/Registration");

exports.addRegistration = (req, res) => {
  let array = [];
  let courseids = JSON.parse(req.body.courseids);

  for (courseid of courseids) {
    array.push(
      new Registration({
        courseid: courseid,
        regno: req.body.regno,
        gradeid: null,
      })
    );
  }
  console.log(array);
  db.Registration.insertMany(array).then(function (regs) {
    res.status(200).json(regs);
  });
};

exports.showRegistration = (req, res) => {
  Promise.all([
    db.Registration.aggregate([
      {
        $match: { regno: req.params.regno },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseid",
          foreignField: "courseid",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "grades",
          localField: "gradeid",
          foreignField: "gradeid",
          as: "grade",
        },
      },
      {
        $unwind: { path: "$grade", preserveNullAndEmptyArrays: true },
      },
    ]),
    db.Grade.find().sort({ gradeid: 1 }),
    db.Registration.aggregate([
      {
        $match: { regno: req.params.regno, gradeid: { $ne: null } },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseid",
          foreignField: "courseid",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "grades",
          localField: "gradeid",
          foreignField: "gradeid",
          as: "grade",
        },
      },
      {
        $unwind: { path: "$grade", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: null,
          tcrhr: { $sum: "$course.crhr" },
          tgpa: { $sum: { $multiply: ["$course.crhr", "$grade.gpa"] } },
        },
      },
      {
        $project: { _id: 0, gpa: { $divide: ["$tgpa", "$tcrhr"] } },
      },
    ]),
  ]).then(function ([regs, grades, gpa]) {
    res.status(200).json([regs, grades, gpa[0]]);
  });
};

exports.getUpdatedGPA = (req, res) => {
  Promise.all([
    db.Registration.aggregate([
      {
        $match: { regno: req.params.regno },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseid",
          foreignField: "courseid",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "grades",
          localField: "gradeid",
          foreignField: "gradeid",
          as: "grade",
        },
      },
      {
        $unwind: { path: "$grade", preserveNullAndEmptyArrays: true },
      },
    ]),
    db.Registration.aggregate([
      {
        $match: { regno: req.params.regno, gradeid: { $ne: null } },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseid",
          foreignField: "courseid",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "grades",
          localField: "gradeid",
          foreignField: "gradeid",
          as: "grade",
        },
      },
      {
        $unwind: { path: "$grade", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: null,
          tcrhr: { $sum: "$course.crhr" },
          tgpa: { $sum: { $multiply: ["$course.crhr", "$grade.gpa"] } },
        },
      },
      {
        $project: { _id: 0, gpa: { $divide: ["$tgpa", "$tcrhr"] } },
      },
    ]),
  ]).then(([regs, gpa]) => {
    res.status(200).json([regs, gpa[0]]);
  });
};

exports.updateRegistration = async (req, res) => {
  let result = await db.Registration.updateOne(
    { _id: req.body.regid },
    {
      $set: {
        gradeid: req.body.gradeid,
      },
    }
  );
  res.status(200).json(result);
};
