import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    alert("Đơn hàng đã được đặt thành công!");
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <div>
      <Header />
      <div className="checkout-container">
        <h1>Thanh toán</h1>

        <div className="checkout-content">
          <div className="checkout-form">
            <h2>Thông tin khách hàng</h2>
            <input type="text" name="name" placeholder="Họ và tên" value={customerInfo.name} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Số điện thoại" value={customerInfo.phone} onChange={handleChange} />
            <input type="text" name="address" placeholder="Địa chỉ nhận hàng" value={customerInfo.address} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={customerInfo.email} onChange={handleChange} />
          </div>

          <div className="checkout-summary">
            <h2>Đơn hàng của bạn</h2>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} className="checkout-item-image" />
                  <div>
                    <p>{item.name}</p>
                    <p>{item.price} x {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3>Tổng tiền: {calculateTotal().toLocaleString()} VNĐ</h3>
            <button className="order-button" onClick={handleOrder}>Đặt hàng</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
