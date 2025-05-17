import React, { useEffect } from "react";
import productStore from "../store/productStore";
import useStore from "../store/store";

const ProductCards = () => {
  const { products, loading, error, fetchProducts } = productStore();
  const { addProduct } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.name}
            className="h-48 w-full object-cover"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-4">
              ${product.price ? product.price.toFixed(2) : "0.00"}
            </p>
            <button
              className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={() => addProduct(product._id)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
