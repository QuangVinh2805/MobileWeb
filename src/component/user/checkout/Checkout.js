import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

import Header from '../header/Header';
import Footer from '../footer/Footer';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8520/user/${userId}`);
      const userData = response.data;
      setCustomerInfo({
        name: userData.name || '',
        phone: userData.phoneNumber || '',
        address: userData.address || '',
        email: userData.email || '',
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const formatCurrency = (value) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value);

  const calculateTotal = () => {
    const itemsToCalculate = selectedItems.length > 0 ? selectedItems : cartItems;
    return itemsToCalculate.reduce((total, item) => {
      const price = item.price || item.productPrice?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleAddressChange = async (event) => {
    const input = event.target.value;
    setCustomerInfo({ ...customerInfo, address: input });

    if (input.trim().length > 2) {
      try {
        const response = await axios.get(
            `https://rsapi.goong.io/geocode?address=${input}&api_key=${import.meta.env.VITE_APP_GOONG_API_KEY}`
        );
        setAddressSuggestions(response.data.results || []);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    setCustomerInfo({ ...customerInfo, address: selectedAddress });
    setAddressSuggestions([]);
  };

  const handleOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const orderPayload = {
        userId,
        address: customerInfo.address,
        cartItems: (selectedItems.length > 0 ? selectedItems : cartItems).map(item => ({
          productId: item.product?.id || item.id,
          productPriceId: item.productPrice?.id || item.productPriceId,
          quantity: item.quantity
        }))
      };

      const response = await axios.post('http://localhost:8520/order/create', orderPayload);
      if (response.status === 200) {
        alert("Bạn đã đặt hàng thành công, vui lòng kiểm tra Email!");
        localStorage.removeItem('cart');
        navigate('/');
      } else {
        alert("Đã có lỗi xảy ra, vui lòng đặt lại!");
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra, vui lòng đặt lại!");
    }
  };

  const itemsToRender = selectedItems.length > 0 ? selectedItems : cartItems;

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
              <input type="text" name="address" placeholder="Địa chỉ nhận hàng" value={customerInfo.address} onChange={handleAddressChange} />
              {addressSuggestions.length > 0 && (
                  <ul className="list-group mt-2">
                    {addressSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleAddressSelect(suggestion.formatted_address)}
                        >
                          {suggestion.formatted_address}
                        </li>
                    ))}
                  </ul>
              )}
              <input type="email" name="email" placeholder="Email" value={customerInfo.email} onChange={handleChange} />
            </div>

            <div className="checkout-summary">
              <h2>Đơn hàng của bạn</h2>
              <ul>
                {itemsToRender.map((item, index) => (
                    <li key={index} className="checkout-item">
                      <img
                          src={item.image || item.product?.avatar}
                          alt={item.name || item.product?.productName}
                          className="checkout-item-image"
                      />
                      <div>
                        <p>{item.name || item.product?.productName}</p>
                        <p>
                          Màu: {item.color || item.productPrice?.color} - Dung lượng: {item.capacity || item.productPrice?.capacity}
                        </p>
                        <p>{formatCurrency(item.price || item.productPrice?.price)} x {item.quantity}</p>
                      </div>
                    </li>
                ))}
              </ul>
              <h3>Tổng tiền: {formatCurrency(calculateTotal())}</h3>
              <button className="order-button" onClick={handleOrder}>Đặt hàng</button>
              {selectedItems.length > 0 && (
                  <button className="back-to-cart" onClick={() => navigate('/cart')}>
                    Quay lại giỏ hàng
                  </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default Checkout;
