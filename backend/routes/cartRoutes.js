const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  incrementCartItem,
  decrementCartItem,
  
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
// router.post("/clear", clearCart);
router.post("/increment", incrementCartItem);
router.post("/decrement", decrementCartItem);
router.post("/checkout", clearCart)
module.exports = router;
