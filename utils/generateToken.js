const jwt = require("jsonwebtoken");

//generate token
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

module.exports = generateToken;
