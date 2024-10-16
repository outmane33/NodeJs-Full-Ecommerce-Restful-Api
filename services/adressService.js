const UserModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.addAdress = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { adresses: req.body },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "adress added successfully",
    data: user.adresses,
  });
});

exports.removeAdress = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { adresses: { _id: req.params.adressId } },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "adress removed successfully",
    data: user.adresses,
  });
});

exports.getLoggedUserAdresses = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("adresses");
  res.status(200).json({
    status: "success",
    result: user.adresses.length,
    data: user.adresses,
  });
});
