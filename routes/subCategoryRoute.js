const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryId,
  setQuery,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const { protect, alowedTo } = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    alowedTo("admin", "manager"),
    setCategoryId,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(setQuery, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .delete(
    protect,
    alowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  )
  .put(
    protect,
    alowedTo("admin", "manager"),
    updatteSubCategoryValidator,
    updateSubCategory
  );

module.exports = router;
