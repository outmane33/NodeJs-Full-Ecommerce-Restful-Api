const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const slugify = require("slugify");

getcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

createCategoryValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

updatteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

module.exports = {
  getcategoryValidator,
  createCategoryValidator,
  updatteCategoryValidator,
  deleteCategoryValidator,
};
