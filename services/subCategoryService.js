const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const SubCategoryModel = require("../models/subCategoryModel");
const slugify = require("slugify");
const apiFeatures = require("../utils/apiFeatures");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");
//set categoryId to body
exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//create query for sub category
exports.setQuery = (req, res, next) => {
  let query = {};
  if (req.params.categoryId) {
    query.category = req.params.categoryId;
  }
  req.query = query;
  next();
};

// Get all sub categories
exports.getSubCategories = getAll(SubCategoryModel);

// Get a single sub category
exports.getSubCategory = getOne(SubCategoryModel);

// Create a new sub category
exports.createSubCategory = createOne(SubCategoryModel);

// Update a sub category
exports.updateSubCategory = updateOne(SubCategoryModel);

// Delete a sub category
exports.deleteSubCategory = deleteOne(SubCategoryModel);
