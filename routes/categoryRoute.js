const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getcategoryValidator,
  updatteCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoryRoute = require("./subCategoryRoute");
const { protect, alowedTo } = require("../services/authService");

//Nested Routes
router.use("/:categoryId/subCategories", subCategoryRoute);
router
  .route("/")
  .post(
    protect,
    alowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(protect, alowedTo("admin", "manager"), getcategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updatteCategoryValidator,
    updateCategory
  )
  .delete(protect, alowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
