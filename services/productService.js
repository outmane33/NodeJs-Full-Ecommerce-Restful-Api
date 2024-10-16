// const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const { uploadMixImages } = require("../middlewares/uploadImageMiddleWare");
const ProductModel = require("../models/poductModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");

// upload multiple images
exports.uploadProductImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// image processing
exports.resizeImages = expressAsyncHandler(async (req, res, next) => {
  // 1- image processing for cover image
  // if (req.files.imageCover) {
  //   const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  //   await sharp(req.files.imageCover[0].buffer)
  //     .resize(2000, 1333)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(`uploads/products/${imageCoverFilename}`);
  //   req.body.imageCover = imageCoverFilename;
  // }
  // // 2- image processing images
  // if (req.files.images) {
  //   req.body.images = [];
  //   await Promise.all(
  //     req.files.images.map(async (image, index) => {
  //       const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  //       await sharp(image.buffer)
  //         .resize(2000, 1333)
  //         .toFormat("jpeg")
  //         .jpeg({ quality: 90 })
  //         .toFile(`uploads/products/${filename}`);
  //       req.body.images.push(filename);
  //     })
  //   );
  // }
  next();
});

// Get all products
exports.getProducts = getAll(ProductModel, "Product");

// Get a single product
exports.getProduct = getOne(ProductModel, "reviews");

// Create a new product
exports.createProduct = createOne(ProductModel);

// Update a product
exports.updateProduct = updateOne(ProductModel);
// Delete a product
exports.deleteProduct = deleteOne(ProductModel);
