import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      cart: {}, // Use an object to track product quantities by ID

      addProduct: async (id) => {
        try {
          const response = await fetch("http://localhost:5000/api/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: id }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          // Map the backend response to update the Zustand cart state
          const updatedCart = result.items.reduce((acc, item) => {
            acc[item.productId] = {
              quantity: item.quantity,
              name: item.name, // Add name to the cart state
            };
            return acc;
          }, {});

          // Update the local Zustand state
          set(() => ({ cart: updatedCart }));

          console.log("Product added to user cart:", result);
        } catch (error) {
          console.error("Error adding product to cart:", error);
        }
      },

      incrProduct: (id) =>
        set((state) => {
          const quantity = state.cart[id] ?? 0;
          return { cart: { ...state.cart, [id]: quantity + 1 } };
        }),

      decrProduct: async (id) => {
        const { cart } = get();
        const quantity = cart[id].quantity ?? 0;
        console.log(quantity);

        if (quantity > 1) {
          try {
            // Make an API call to decrement the product quantity
            const response = await fetch(
              "http://localhost:5000/api/decrement",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id }),
              }
            );

            if (response.ok) {
              // Update the state only after a successful API call
              set((state) => ({
                cart: { ...state.cart, [id]: quantity - 1 },
              }));
              console.log("Decremented product in UI and database");
            } else {
              console.error("Failed to decrement product in database");
            }
          } catch (error) {
            console.error("Error decrementing product:", error);
          }
        } else if (quantity === 1) {
          try {
            // Make an API call to remove the product from the cart
            const response = await fetch("/api/remove", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: id }),
            });

            if (response.ok) {
              // Remove the product from the state after successful API call
              set((state) => {
                const newCart = { ...state.cart };
                delete newCart[id];
                return { cart: newCart };
              });
              console.log("Removed product from UI and database");
            } else {
              console.error("Failed to remove product in database");
            }
          } catch (error) {
            console.error("Error removing product:", error);
          }
        }
      },

      resetProduct: () => set({ cart: {} }),
    }),
    { name: "product-data" } // Configuration for persist middleware
  )
);

export default useStore;
