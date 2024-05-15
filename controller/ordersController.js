require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../modals/orderModal");
const User = require("../modals/userModal");
exports.createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = req.body;
    console.log(req.body);
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }
    res.json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
};

exports.validateOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit" });
  }
  res.json({
    msg: "Success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};

exports.createUserOrder = async (req, res) => {
  try {
    const {
      payment_id,
      razorpay_order_id,
      user_id,
      products,
      billAmount,
      status,
      totalQuantity,
    } = req.body;
    console.log(
      payment_id,
      razorpay_order_id,
      user_id,
      products,
      billAmount,
      status,
      totalQuantity
    );
    const newOrder = await Order.create({
      payment_id,
      razorpay_order_id,
      user: user_id,
      products,
      billAmount,
      status,
      totalQuantity,
    });

    await User.findByIdAndUpdate(user_id, { $push: { orders: newOrder._id } });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userOrders = await Order.find({ user: userId });

    res.status(200).json({ orders: userOrders });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUserOrder = async (req, res) => {
  try {
    const payment_id = req.params.orderId;
    console.log(payment_id);
    const deletedOrder = await Order.findOneAndDelete({ payment_id });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order cancelled successfully", deletedOrder });
  } catch (error) {
    console.error("Error deleting user order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
