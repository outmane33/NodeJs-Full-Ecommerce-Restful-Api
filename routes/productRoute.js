const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImages,
} = require("../services/productService");
const {
  createProductValidator,
  getProductValidator,
  deleteProductValidator,
  updatteProductValidator,
} = require("../utils/validators/productValidator");
const { protect, alowedTo } = require("../services/authService");
const reviewRoute = require("./reviewRoute");
const router = express.Router();

//Nested Routes
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .post(
    protect,
    alowedTo("admin", "manager"),
    uploadProductImages,
    resizeImages,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    alowedTo("admin", "manager"),
    uploadProductImages,
    resizeImages,
    updatteProductValidator,
    updateProduct
  )
  .delete(protect, alowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
