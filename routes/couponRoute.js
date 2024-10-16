const express = require("express");
const {
  createCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
const { protect, alowedTo } = require("../services/authService");
const router = express.Router();

router.use(protect, alowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
