const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const slugify = require("slugify");
const UserModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

const createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  check("profileImage").optional(),
  check("role")
    .optional()
    .isIn(["admin", "user", "manager"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

const getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id format"),
  validatorMiddleware,
];

const updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("email already exists");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  check("profileImage").optional(),
  check("role")
    .optional()
    .isIn(["admin", "user", "manager"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];

const deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id format"),
  validatorMiddleware,
];

// Change Password Validator
const changeUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("passwordConfirm").notEmpty().withMessage("New password is required"),
  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (value, { req }) => {
      //1- check user if exists
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      //2- check if currentPassword == user.password
      const isMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }
      //3- verify passwordconfirm
      if (value !== req.body.passwordConfirm) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validatorMiddleware,
];

const updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const email = await UserModel.findOne({ email: value });
      if (email) {
        throw new Error("email already exists");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  validatorMiddleware,
];

module.exports = {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
};
