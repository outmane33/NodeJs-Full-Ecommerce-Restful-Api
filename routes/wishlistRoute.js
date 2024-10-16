const express = require("express");
const { protect, alowedTo } = require("../services/authService");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");
const router = express.Router();

router.use(protect, alowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);
router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;
