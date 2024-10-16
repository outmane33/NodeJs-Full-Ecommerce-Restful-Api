const { default: mongoose } = require("mongoose");
const ProductModel = require("./poductModel");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      required: [true, "Rating is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // stage 2 : grouping reviews base on product id and calculate averageRating, quantity
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$ratings" },
        quantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].averageRating,
      ratingsQuantity: result[0].quantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  }
);

const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel;
