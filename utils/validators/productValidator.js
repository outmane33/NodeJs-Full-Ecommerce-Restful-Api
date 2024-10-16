const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");
const slugify = require("slugify");

createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Product title must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 3 })
    .withMessage("Product description must be at least 3 characters")
    .isLength({ max: 2000 })
    .withMessage("Product description must be at most 255 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Product price must be at most 32 characters"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of strings"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid category id format")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error("category not found");
      }
      return true;
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .custom(async (value, { req }) => {
      const subCategory = await SubCategoryModel.find({
        _id: { $in: req.body.subCategory },
      });

      console.log(subCategory);

      if (
        subCategory < 1 ||
        subCategory.length != req.body.subCategory.length
      ) {
        throw new Error("subCategory not found");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      let subCategories = await SubCategoryModel.find({
        category: req.body.category,
      });
      subCategories = subCategories.map((subCategory) =>
        subCategory._id.toString()
      );
      const checker = req.body.subCategory.every((e) =>
        subCategories.includes(e)
      );
      if (!checker) {
        throw new Error("subCategory must belong to the category");
      }
      return true;
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("ratingsAverage must be at least 1")
    .isLength({ max: 5 })
    .withMessage("ratingsAverage must be at most 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

updatteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  check("title").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

module.exports = {
  createProductValidator,
  getProductValidator,
  updatteProductValidator,
  deleteProductValidator,
};
