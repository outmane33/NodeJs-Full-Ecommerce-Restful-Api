const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setQuery,
  setProductId,
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect, alowedTo } = require("../services/authService");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    alowedTo("user"),
    setProductId,
    createReviewValidator,
    createReview
  )
  .get(setQuery, getReviews);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, alowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    alowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
