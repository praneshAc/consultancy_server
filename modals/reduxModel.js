const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({
  id: String,
  price: Number,
  quantity: Number,
  totalPrice: Number,
  productName: String,
  image:String,
});
const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalQuantity: {
    type: Number,
    required: true,
  },
  userId: { type: String },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
