const CouponModel = require("../models/couponModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");

//DESC : Get all Coupons
//ROUTE : GET /api/v1/coupons
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.getCoupons = getAll(CouponModel);

//DESC : Get single Coupon
//ROUTE : GET /api/v1/coupons/:id
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.getCoupon = getOne(CouponModel);

//DESC : Create Coupon
//ROUTE : POST /api/v1/coupons/:id
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.createCoupon = createOne(CouponModel);

//DESC : Update Coupon
//ROUTE : PUT /api/v1/coupons/:id
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.updateCoupon = updateOne(CouponModel);

//DESC : Delete Coupon
//ROUTE : DELETE /api/v1/coupons/:id
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.deleteCoupon = deleteOne(CouponModel);
