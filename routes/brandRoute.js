const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  updatteBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const { protect, alowedTo } = require("../services/authService");

router
  .route("/")
  .post(
    protect,
    alowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    alowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updatteBrandValidator,
    updateBrand
  )
  .delete(protect, alowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
