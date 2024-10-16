const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
  getValidCouops,
} = require("../services/cartService");
const { protect, alowedTo } = require("../services/authService");
const router = express.Router();

router.use(protect, alowedTo("user"));
router.route("/applyCoupon").put(applyCoupon);
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);
router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
