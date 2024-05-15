const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product should have a name"],
  },
  description: {
    type: String,
    required: [true, "Product should have a description"],
  },
  price: {
    type: Number,
    required: [true, "Product should have a price"],
  },
  image: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
