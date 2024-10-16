const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/poductModel");
const { getAll, getOne } = require("../utils/handlerFactory");

//DESC : create cash order
//ROUTE : POST /api/v1/orders/cartId
//ACCESS : PRIVATE/USER
exports.createCashOrder = expressAsyncHandler(async (req, res, next) => {
  //app setting
  const taxtPrice = 0;
  const shippingPrice = 0;

  // 1. Get cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  // 2. Get Order Price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxtPrice + shippingPrice;
  // 3. create order with default payment method "cash"
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAdress: req.body.shippingAdress,
    totalOrderPrice,
  });
  // 4. after creating order, decriment product quantity, increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((e) => ({
      updateOne: {
        filter: { _id: e.product },
        update: { $inc: { quantity: -e.quantity, sold: +e.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions);
  }
  // 5. clear cart depend on cartId
  await cart.deleteOne({ _id: req.params.cartId });

  res.status(201).json({
    status: "success",
    data: order,
  });
});

//create query for sub category
exports.setQuery = (req, res, next) => {
  let query = {};
  if (req.user.role == "user") {
    query.user = req.user._id;
  }
  req.query = query;
  next();
};

//DESC : Get all Orders
//ROUTE : GET /api/v1/orders
//ACCESS : PRIVATE/USER-ADMIN-MANAGER
exports.getAllOrders = getAll(OrderModel);

//DESC : Get single Order
//ROUTE : GET /api/v1/orders/:id
//ACCESS : PRIVATE/USER-ADMIN-MANAGER
exports.getOrder = getOne(OrderModel);

//DESC : Update Order to paid
//ROUTE : PUT /api/v1/orders/:id/pay
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.updateOrderToPaid = expressAsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no order for this id: ${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//DESC : Update Order to delivered
//ROUTE : PUT /api/v1/orders/:id/deliver
//ACCESS : PRIVATE/ADMIN-MANAGER
exports.updateOrderToDelivered = expressAsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no order for this id: ${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

//desc    Get checkout session from stripe and send it as response
//route   GET /api/v1/orders/checkout-session/:cartId
//access  Protected/User
exports.checkoutSession = expressAsyncHandler(async (req, res, next) => {
  // app setting
  const taxtPrice = 0;
  const shippingPrice = 0;

  // 1. Get cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  // 2. Get Order Price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxtPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          // currency: "egp",
          currency: "mad",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: "success", session });
});
