const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/order.js"); // Update the path as needed

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
  try {
    console.log(req.body); // Log the request body for debugging

    // Extract products from request body (assumes an array of products is sent)
    const { cartItems } = req.body; // Expect cartItems to be an array of { productId, quantity }

    if (!cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty or invalid data received" });
    }

    console.log("Before saving order");

    // Create an order with the received cart items
    const order = await Order.create({
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    console.log(order, "Order created");

    // Delete items from the cart based on product IDs
    const productIds = cartItems.map((item) => item.productId);
    const deletedItems = await Cart.deleteMany({
      productId: { $in: productIds },
    });

    console.log(deletedItems, "Items removed from cart");

    // Send the response
    res.status(200).json({
      message: "Cart cleared and order created",
      order,
      deletedItems,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
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
