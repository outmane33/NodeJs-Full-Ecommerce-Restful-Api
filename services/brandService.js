const BrandModel = require("../models/brandModel");
const expressAsyncHandler = require("express-async-handler");
// const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../utils/handlerFactory");
const { uploadSigleImage } = require("../middlewares/uploadImageMiddleWare");

// upload single image
exports.uploadBrandImage = uploadSigleImage("image");

// image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  // await sharp(req.file.buffer)
  //   .resize(600, 600)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`uploads/brands/${filename}`);
  // req.body.image = filename;
  // next();
});

//DESC : Get all brands
//ROUTE : GET /api/v1/brands
//ACCESS : PUBLIC
exports.getBrands = getAll(BrandModel);

//DESC : Get single brand
//ROUTE : GET /api/v1/brands/:id
//ACCESS : PUBLIC
exports.getBrand = getOne(BrandModel);

//DESC : Create a brand
//ROUTE : POST /api/v1/brands
//ACCESS : PRIVATE/ADMIN
exports.createBrand = createOne(BrandModel);

//DESC : Update a brand
//ROUTE : PUT /api/v1/brands/:id
//ACCESS : PRIVATE/ADMIN
exports.updateBrand = updateOne(BrandModel);

//DESC : Delete a brand
//ROUTE : DELETE /api/v1/brands/:id
//ACCESS : PRIVATE/ADMIN
exports.deleteBrand = deleteOne(BrandModel);
