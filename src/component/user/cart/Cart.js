import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Đảm bảo mỗi sản phẩm có quantity ít nhất là 1
    const updatedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    } else {
      removeItem(index);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <div>
      <Header />
      <div className="cart-container">
        <h1>Giỏ hàng của bạn</h1>
        {cartItems.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống</p>
        ) : (
          <div>
            <ul className="cart-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    <p className="cart-price">{item.price}</p>
                    <p className="cart-color">Màu: {item.color}</p>
                    <p className="cart-capacity">Phiên bản: {item.capacity}</p>
                    
                    <div className="quantity-controls">
                      <button className="quantity-button" onClick={() => decreaseQuantity(index)}>
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button className="quantity-button" onClick={() => increaseQuantity(index)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <button className="remove-button" onClick={() => removeItem(index)}>
                      <FontAwesomeIcon icon={faTrash} /> Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-actions">
              <button className="clear-cart" onClick={clearCart}>Xóa tất cả</button>
              <button className="continue-shopping" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
              <button className="checkout" onClick={() => navigate('/checkout')}>Thanh toán</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
