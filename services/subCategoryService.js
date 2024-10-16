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
const setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//create query for sub category
const setQuery = (req, res, next) => {
  let query = {};
  if (req.params.categoryId) {
    query.category = req.params.categoryId;
  }
  req.query = query;
  next();
};

// Get all sub categories
const getSubCategories = getAll(SubCategoryModel);

// Get a single sub category
const getSubCategory = getOne(SubCategoryModel);

// Create a new sub category
const createSubCategory = createOne(SubCategoryModel);

// Update a sub category
const updateSubCategory = updateOne(SubCategoryModel);

// Delete a sub category
const deleteSubCategory = deleteOne(SubCategoryModel);

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryId,
  setQuery,
};
