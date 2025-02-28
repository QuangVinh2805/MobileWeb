import React from "react";
import Home from "./component/user/home/Home";
import Product from "./component/user/product/Product";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from "./component/user/cart/Cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
