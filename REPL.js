const db = require("./models");

// db.Student.find({ regno: "1112108" }).then((student) => {
//   console.log(student[0]);
//   process.exit();
// });

// db.Course.find({ semester: 1 })
//   .sort({ courseid: 1 })
//   .then((sem) => {
//     console.log(sem);
//     process.exit();
//   });

// db.Registration.aggregate([
//   {
//     $match: { regno: 1112102, gradeid: { $ne: null } },
//   },
//   {
//     $lookup: {
//       from: "courses",
//       localField: "courseid",
//       foreignField: "courseid",
//       as: "course",
//     },
//   },
//   {
//     $unwind: "$course",
//   },
//   {
//     $lookup: {
//       from: "grades",
//       localField: "gradeid",
//       foreignField: "gradeid",
//       as: "grade",
//     },
//   },
//   {
//     $unwind: { path: "$grade", preserveNullAndEmptyArrays: true },
//   },
//   {
//     $group: {
//       _id: null,
//       tcrhr: { $sum: "$course.crhr" },
//       tgpa: { $sum: { $multiply: ["$course.crhr", "$grade.gpa"] } },
//     },
//   },
//   {
//     $project: { _id: 0, gpa: { $divide: ["$tgpa", "$tcrhr"] } },
//   },
// ]).then((res) => {
//   console.log(JSON.stringify(res, null, "\t"));
// });

db.Registration.aggregate([
  {
    $match: { regno: "1112101", gradeid: { $ne: null } },
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
]).then((res) => {
  console.log(res);
});
