const express = require("express");
const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");
const ReviewModel = require("../models/reviewModel");

//Nested Route
//Get /api/v1/products/productId/reviews
exports.setQuery = (req, res, next) => {
  let query = {};
  if (req.params.productId) {
    query.product = req.params.productId;
  }
  req.query = query;
  next();
};

//set categoryId to body
exports.setProductId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//DESC : Get all Reviews
//ROUTE : GET /api/v1/reviews
//ACCESS : PUBLIC
exports.getReviews = getAll(ReviewModel);

//DESC : Get single Review
//ROUTE : GET /api/v1/reviews/:id
//ACCESS : PUBLIC
exports.getReview = getOne(ReviewModel);

//DESC : Create Review
//ROUTE : POST /api/v1/reviews
//ACCESS : PRIVATE/PROTECT/USER
exports.createReview = createOne(ReviewModel);

//DESC : Update Review
//ROUTE : PUT /api/v1/reviews/:id
//ACCESS : PRIVATE/PROTECT/USER
exports.updateReview = updateOne(ReviewModel);

//DESC : Delete Review
//ROUTE : DELETE /api/v1/reviews/:id
//ACCESS : PRIVATE/PROTECT/USER-ADMIN-MANAGER
exports.deleteReview = deleteOne(ReviewModel);
