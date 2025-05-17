import logo from "./logo.svg";
import "./App.css";
import ShoppingCart from "./components/Cart";
import ProductCards from "./components/ProductCards";

function App() {
  return (
    <>
      <ProductCards />
      <ShoppingCart />
    </>
  );
}

export default App;
