const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getOrder,
  setQuery,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");
const { protect, alowedTo } = require("../services/authService");
const router = express.Router();

router.use(protect);

router
  .route("/checkout-session/:cartId")
  .get(alowedTo("user"), checkoutSession);

router.route("/:cartId").post(alowedTo("user"), createCashOrder);
router
  .route("/")
  .get(alowedTo("user", "admin", "manager"), setQuery, getAllOrders);
router.route("/:id").get(getOrder);

router.route("/:id/pay").put(alowedTo("admin", "manager"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(alowedTo("admin", "manager"), updateOrderToDelivered);

module.exports = router;
