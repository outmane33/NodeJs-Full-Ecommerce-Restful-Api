const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a coupon name"],
      unique: true,
      trim: true,
      maxlength: [32, "Coupon name can not be more than 32 characters"],
    },
    expire: {
      type: Date,
      required: [true, "Please provide a coupon expire date"],
    },
    discount: {
      type: Number,
      required: [true, "Please provide a coupon discount"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model("Coupon", couponSchema);
module.exports = CouponModel;
