const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  Student: require("./Student"),
  Course: require("./Course"),
  Registration: require("./Registration"),
  Grade: require("./Grade"),
};
