const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const slugify = require("slugify");

getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 3 })
    .withMessage("subCategory name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("subCategory name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

updatteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];

module.exports = {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updatteSubCategoryValidator,
};
