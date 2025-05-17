const mongoose = require("mongoose");

// Define the schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },

});

// Create a model from the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
