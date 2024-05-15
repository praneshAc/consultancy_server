const Admin = require("../modals/adminModal");
const User = require("../modals/userModal");
const Product = require("../modals/productModal");
const Order = require("../modals/orderModal");
const createError = require("../utils/appError");
const jwt = require("jsonwebtoken");
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return next(new createError("User not found!", 401));
    if (password !== user.password) {
      return next(new createError("Invalid password", 401));
    }

    const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "12h",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: {
          street: user.address,
          city: user.city,
          pincode: user.pincode,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.calculateStatistics = async (req, res) => {
  try {
    // Count the total number of users
    const totalUsers = await User.countDocuments();

    // Count the total number of products
    const totalProducts = await Product.countDocuments();
    // Count the total number of orders
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({}, { billAmount: 1 });
    const orderstatus = await Order.find({}, { status: 1 });
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.billAmount,
      0
    );
    const orderStatuses = orderstatus.map((order) => order.status);
    res.status(200).json({
      status: "success",
      statistics: {
        totalUsers: totalUsers,
        totalProducts: totalProducts,
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        orderStatus: orderStatuses,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrder = async (req, res) => {
  const orders = await Order.find().populate("user");

  res.status(200).json({
    status: "success",
    orders,
  });
};

exports.getAllUser = async (req, res) => {
  const usersWithOrders = await User.find().populate("orders");
  res.status(200).json({
    status: "success",
    user: usersWithOrders,
  });
};

exports.changeStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status
    order.status = status;
    await order.save();

    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};
