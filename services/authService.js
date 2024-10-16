const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

//generate token
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//signup
const signUp = expressAsyncHandler(async (req, res, nect) => {
  //create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //generate JWT
  const token = generateToken(user._id);
  res.status(201).json({
    user,
    token,
  });
});

//login
const login = expressAsyncHandler(async (req, res, next) => {
  //check user if exists and password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  //generate JWT
  const token = generateToken(user._id);
  res.status(200).json({
    user,
    token,
  });
});

// make sure user is logged in
const protect = expressAsyncHandler(async (req, res, next) => {
  //check if token exists if exists get if not throw error
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("you are not login, please login to get access", 401)
    );
  }
  //verify token (no change happened ,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //check if user still exists
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token does no longer exist", 401)
    );
  }

  //check if user changed password after the token was created
  if (currentUser.passwordChangedAt) {
    const changedTime = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changedTime > decoded.iat) {
      return next(
        new ApiError("User recently changed password, please login again", 401)
      );
    }
  }

  req.user = currentUser;
  next();
});

//authorization (user permissions)
// ["admin","manager"]
const alowedTo = (...roles) => {
  return expressAsyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};

//forgot password
const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  //  1. Get user By email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with that email", 404));
  }
  // 2. Generate random 6 digits and
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashCode = crypto.createHash("sha256").update(resetCode).digest("hex");

  // save it in database
  user.passwordResetCode = hashCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 3. send it to user email

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message: `hi, ${user.name} \nWe received a request to reset your password. If you requested for password reset,\nuse this code ${resetCode} to reset your password.`,
    });
  } catch (err) {
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = null;
    await user.save();
    return next(new ApiError(err.message, 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to your email",
  });
});
// verify reset code
const verifyPassResetCode = expressAsyncHandler(async (req, res, next) => {
  //get user by passwordResetCode and passwordResetExpires > Date.now
  const hashCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code is Invalid or expired", 400));
  }

  //password reset code verified
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
  });
});

//reset password
const resetPassword = expressAsyncHandler(async (req, res, next) => {
  //get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with that email", 404));
  }
  //check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetVerified = null;
  user.passwordResetCode = null;
  user.passwordResetExpires = null;
  await user.save();

  //generate JWT
  const token = generateToken(user._id);

  res.status(200).json({ token });
});

module.exports = {
  signUp,
  login,
  protect,
  alowedTo,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
};
