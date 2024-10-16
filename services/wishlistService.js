const UserModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.addProductToWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "product added to wishlist",
    data: user.wishList,
  });
});

exports.removeProductFromWishlist = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishList: req.params.productId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      message: "product removed from wishlist",
      data: user.wishList,
    });
  }
);

exports.getLoggedUserWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    result: user.wishList.length,
    data: user.wishList,
  });
});
