const UserModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
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
const generateToken = require("../utils/generateToken");

// upload single image
exports.uploadProductImage = uploadSigleImage("profileImage");

// image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  // if (req.file) {
  //   const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  //   await sharp(req.file.buffer)
  //     .resize(600, 600)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(`uploads/users/${filename}`);
  //   req.body.profileImage = filename;
  // }
  next();
});

//DESC : Get All Users
//ROUTE : GET /api/v1/users
//ACCESS : Private/ADMIN
exports.getUsers = getAll(UserModel);

//DESC : Get Single User
//ROUTE : GET /api/v1/users/:id
//ACCESS : Private/ADMIN
exports.getUser = getOne(UserModel);

//DESC : Create User
//ROUTE : POST /api/v1/users
//ACCESS : Private/ADMIN
exports.createUser = createOne(UserModel);

//DESC : Update User
//ROUTE : PUT /api/v1/users/:id
//ACCESS : Private/ADMIN
exports.updateUser = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
      active: req.body.active,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`document not found ${id}`, 404));
  }
  res.status(200).json(document);
});

//DESC : Change User Password
//ROUTE : PUT /api/v1/users/change-password/:id
//ACCESS : Private/ADMIN
exports.changeUserPassword = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`document not found ${id}`, 404));
  }
  res.status(200).json(document);
});

//DESC : Delete User
//ROUTE : DELETE /api/v1/users/:id
//ACCESS : Private/ADMIN
exports.deleteUser = deleteOne(UserModel);

//DESC : Get Logged User
//ROUTE : GET /api/v1/users/me
//ACCESS : Private/User
exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//DESC : Update Logged User Password
//ROUTE : PUT /api/v1/users/change-password
//ACCESS : Private/User
exports.updateLoggedUserPassword = expressAsyncHandler(
  async (req, res, next) => {
    //update user password based on user (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    //generate token
    const token = generateToken(user._id);
    res.status(200).json({
      user,
      token,
    });
  }
);

//DESC : Update Logged User Data
//ROUTE : PUT /api/v1/users/me
//ACCESS : Private/User
exports.updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  //update user password based on user (req.user._id)
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

//DESC : Delete Logged User Data
//ROUTE : DELETE /api/v1/users/me
//ACCESS : Private/User
exports.deleteLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(204).json({
    status: "success",
  });
});
