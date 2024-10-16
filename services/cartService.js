const expressAsyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/poductModel");
const ApiError = require("../utils/apiError");
const CouponModel = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  cart.totalCartPrice = total;
  cart.totalPriceAfterDiscount = undefined;
  return total;
};

//DESC : Add Product To Cart
//ROUTE : POST /api/v1/cart
//ACCESS : Private/User
exports.addProductToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);
  // 1. Get cart of logged user
  let cart = await CartModel.findOne({ user: req.user._id });

  // 2. If cart not exist, create cart
  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color: color,
          price: product.price,
        },
      ],
    });
  } else {
    // 3. If cart exist, check if product exist in cart
    // 4. If product exist in cart, increment quantity
    const productIndex = cart.cartItems.findIndex(
      (e) => e.product == productId && e.color == color
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // 5. If product not exist in cart, push product to cart
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }

    // 6. calculate total price
    calcTotalCartPrice(cart);

    // 7. Save cart
    await cart.save();
  }
  res.status(200).json({
    status: "success",
    message: "product added to cart",
    numOfItems: cart.cartItems.length,
    data: cart,
  });
});

//DESC : Get Logged User Cart
//ROUTE : GET /api/v1/cart
//ACCESS : Private/User
exports.getLoggedUserCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfItems: cart.cartItems.length,
    data: cart,
  });
});

//DESC : Remove Specific Product From Cart
//ROUTE : DELETE /api/v1/cart/:productId
//ACCESS : Private/User
exports.removeSpecificCartItem = expressAsyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    {
      new: true,
    }
  );

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfItems: cart.cartItems.length,
    data: cart,
  });
});

//DESC : Clear Cart
//ROUTE : DELETE /api/v1/cart/
//ACCESS : Private/User
exports.clearCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).json({});
});

//DESC : Update Cart Item Quantity
//ROUTE : PUT /api/v1/cart/:itemId
//ACCESS : Private/User
exports.updateCartItemQuantity = expressAsyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  const productIndex = cart.cartItems.findIndex(
    (e) => e._id == req.params.itemId
  );
  if (productIndex > -1) {
    cart.cartItems[productIndex].quantity = quantity;
  } else {
    return next(
      new ApiError(
        `there is no product with this id: ${req.params.itemId}`,
        404
      )
    );
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfItems: cart.cartItems.length,
    data: cart,
  });
});

//DESC : Apply Coupon
//ROUTE : POST /api/v1/cart/applyCoupon
//ACCESS : Private/User
exports.applyCoupon = expressAsyncHandler(async (req, res, next) => {
  //1. Get coupon
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 404));
  }
  //2. Get logged user Cart
  const cart = await CartModel.findOne({ user: req.user._id });
  const totalCartPrice = cart.totalCartPrice;

  //3. Apply coupon
  const totalPriceAfterDiscount = (
    totalCartPrice -
    (totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  //4. Save cart
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfItems: cart.cartItems.length,
    data: cart,
  });
});
