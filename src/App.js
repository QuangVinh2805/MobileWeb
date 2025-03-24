import React from "react";
import Home from "./component/user/home/Home";
import Product from "./component/user/product/Product";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from "./component/user/cart/Cart";
import Checkout from "./component/user/checkout/Checkout";
import Login from "./component/LoginAndRegister/Login";
import Register from "./component/LoginAndRegister/Register";
import ManageProduct from "./component/admin/ProductManagement";
import ManageUser from "./component/admin/UserManagement";
import Sidebar from "./component/admin/Sidebar";
import AdminLayout from "./AdminLayout";

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
        {/* Trang quản trị */}
        <Route
            path="/admin/manageProduct"
            element={
              <AdminLayout>
                <ManageProduct />
              </AdminLayout>
            }
        />
        <Route
            path="/admin/manageUser"
            element={
              <AdminLayout>
                <ManageUser />
              </AdminLayout>
            }
        />
      </Routes>
    </Router>
  );
}

export default App;
