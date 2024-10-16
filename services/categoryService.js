const { v4: uuidv4 } = require("uuid");
const CategoryModel = require("../models/categoryModel");
const expressAsyncHandler = require("express-async-handler");
// const sharp = require("sharp");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");
const { uploadSigleImage } = require("../middlewares/uploadImageMiddleWare");

// upload single image
const uploadCategoryImage = uploadSigleImage("image");

// image processing
const resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  // await sharp(req.file.buffer)
  //   .resize(600, 600)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`uploads/categories/${filename}`);
  // req.body.image = filename;
  next();
});

// Get all categories
const getCategories = getAll(CategoryModel);

// Get a single category
const getCategory = getOne(CategoryModel);

// Create a new category
const createCategory = createOne(CategoryModel);

// Update a category
const updateCategory = updateOne(CategoryModel);

// Delete a category
const deleteCategory = deleteOne(CategoryModel);

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
};
