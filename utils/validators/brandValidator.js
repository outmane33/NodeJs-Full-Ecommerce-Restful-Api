const validatorMiddleware = require("../../middlewares/validatorMiddleWare");
const { check } = require("express-validator");
const slugify = require("slugify");

getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

updatteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

module.exports = {
  getBrandValidator,
  createBrandValidator,
  updatteBrandValidator,
  deleteBrandValidator,
};
