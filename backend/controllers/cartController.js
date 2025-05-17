const Cart = require("../models/cartModel");
const Product= require("../models/productModel")
// Get the cart
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
    await cart.save();
  }
  res.json(cart);
};

// Add item to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Find product to get its name
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.name, // store product name here
      quantity,
    });
  }

  await cart.save();
  res.json(cart);
};

// Remove item from the cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne();
  if (cart) {
    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
  }
  res.json(cart || { items: [] });
};

// Clear the cart
exports.clearCart = async (req, res) => {
  await Cart.deleteMany();
  res.json({ message: "Cart cleared" });
};

// Increment item quantity in the cart
exports.incrementCartItem = async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne();
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
    await cart.save();
    return res.json(cart);
  }

  return res.status(404).json({ message: "Item not found in the cart" });
};

// Decrement item quantity in the cart
exports.decrementCartItem = async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne();
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      // If quantity becomes 0, remove the item from the cart
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();
    return res.json(cart);
  }

  return res.status(404).json({ message: "Item not found in the cart" });
};

