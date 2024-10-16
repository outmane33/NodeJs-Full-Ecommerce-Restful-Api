const express = require("express");
const { protect, alowedTo } = require("../services/authService");
const {
  addAdress,
  removeAdress,
  getLoggedUserAdresses,
} = require("../services/adressService");
const router = express.Router();

router.use(protect, alowedTo("user"));

router.route("/").post(addAdress).get(getLoggedUserAdresses);
router.route("/:adressId").delete(removeAdress);

module.exports = router;
