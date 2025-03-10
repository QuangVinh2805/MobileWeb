import React from "react";
import Home from "./component/user/home/Home";
import Product from "./component/user/product/Product";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from "./component/user/cart/Cart";
import Checkout from "./component/user/checkout/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
