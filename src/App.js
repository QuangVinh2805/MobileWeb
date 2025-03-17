import React from "react";
import Home from "./component/user/home/Home";
import Product from "./component/user/product/Product";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from "./component/user/cart/Cart";
import Checkout from "./component/user/checkout/Checkout";
import Login from "./component/LoginAndRegister/Login";
import Register from "./component/LoginAndRegister/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login/> } />
          <Route path="/register" element={<Register/> } />
      </Routes>
    </Router>
  );
}

export default App;
