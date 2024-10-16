const express = require("express");
const {
  sinUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const {
  signUp,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.route("/signup").post(sinUpValidator, signUp);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyResetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
