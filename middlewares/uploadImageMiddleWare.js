const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 1- Disque storage engine
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split("/")[1];
  //     cb(null, `category-${uuidv4()}.${ext}`);
  //   },
  // });
  // 2- Memory storage engine
  const multerStorage = multer.memoryStorage();

  // file filter
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

const uploadSigleImage = (fieldName) => multerOptions().single(fieldName);

const uploadMixImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

module.exports = { uploadSigleImage, uploadMixImages };
