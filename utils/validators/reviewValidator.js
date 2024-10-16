const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const ReviewModel = require("../../models/reviewModel");

createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 and 5"),
  check("user")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id format"),
  check("product")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (value, { req }) => {
      // check if logged user has already reviewed this product
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("You have already reviewed this product");
      }
      return true;
    }),
  validatorMiddleware,
];

getReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid review id format"),
  validatorMiddleware,
];

updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom(async (value, { req }) => {
      //check review ownership before update
      const review = await ReviewModel.findById(value);
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.user._id.toString() != req.user._id.toString()) {
        throw new Error("You are not authorized to update this review");
      }
      return true;
    }),
  validatorMiddleware,
];

deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom(async (value, { req }) => {
      //check review ownership before delete
      if (req.user.role == "user") {
        const review = await ReviewModel.findById(value);
        if (!review) {
          throw new Error("Review not found");
        }
        if (review.user._id.toString() != req.user._id.toString()) {
          throw new Error("You are not authorized to delete this review");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
};
