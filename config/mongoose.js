const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(
  `mongodb+srv://harshrathore98626:${process.env.MONGOOSE_PASSWORD}@cluster0.uadil61.mongodb.net/?retryWrites=true&w=majority`
);

const db = mongoose.connection;

db.on("error", () => {
  console.log("An Error occured while connection to DB");
});
db.once(`open`, () => {
  console.log("Connection to Database successful");
});

module.exports = db;
