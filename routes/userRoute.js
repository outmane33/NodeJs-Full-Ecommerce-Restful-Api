const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadProductImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const { protect, alowedTo } = require("../services/authService");

router.use(protect);

router.route("/getMe").get(getLoggedUserData, getUser);
router.route("/changeMyPassword").put(updateLoggedUserPassword);
router.route("/updateMe").put(updateLoggedUserValidator, updateLoggedUserData);
router.route("/deleteMe").delete(deleteLoggedUserData);

// Admin
router.use(alowedTo("admin", "manager"));
router
  .route("/")
  .post(uploadProductImage, resizeImage, createUserValidator, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadProductImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);
module.exports = router;
