import React from "react";
import useStore from "../store/store";
import productStore from "../store/productStore";

const ShoppingCart = () => {
  const { cart, incrProduct, decrProduct, resetProduct } = useStore();

  // Calculate total
  const total = Object.values(cart)
    .reduce((sum, { quantity }) => sum + quantity, 0)
    .toFixed(2);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Shopping Cart</h1>

      {Object.entries(cart).map(([productId, { name, quantity }]) => (
        <div
          key={productId}
          className="flex items-center justify-between border-b pb-2 mb-2"
        >
          <div>
            <h2 className="font-semibold text-lg">{name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => decrProduct(productId)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => incrProduct(productId)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4">
        <h2 className="text-lg font-bold">Total: ${total}</h2>
        <button
          onClick={resetProduct}
          className="w-full bg-red-500 text-white py-2 mt-4 rounded hover:bg-red-600"
        >
          Reset Cart
        </button>
        <button className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
