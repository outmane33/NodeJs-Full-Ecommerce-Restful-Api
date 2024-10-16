const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const slugify = require("slugify");
const UserModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

const sinUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("email already exists");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  validatorMiddleware,
];

const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters"),
  validatorMiddleware,
];

module.exports = {
  sinUpValidator,
  loginValidator,
};
