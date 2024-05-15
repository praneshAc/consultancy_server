const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new mongoose.Schema({
  payment_id: String,
  razorpay_order_id: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      _id: String,
      name: String,
      quantity: Number,
    },
  ],
  billAmount: Number,
  status: String,
  totalQuantity: Number,
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
