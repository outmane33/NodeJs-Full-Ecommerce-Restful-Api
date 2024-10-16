const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = function () {
  mongoose.connect(process.env.CONNECTION_STRING).then(function (result) {
    console.log(`connected to database ${result.connection.host}`);
  });
};

module.exports = { dbConnection };
