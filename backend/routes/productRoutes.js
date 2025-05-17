const express = require("express");
const Product = require("../models/productModel");

const router = express.Router();

// Fetch all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from DB
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
