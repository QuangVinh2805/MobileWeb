import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await axios.get(`http://localhost:8520/cart/getCartByUser?userId=${userId}`);
        const fetchedCart = response.data.map(item => ({
          id: item.id,
          name: item.product.productName,
          price: item.productPrice.price,
          image: item.product.avatar,
          color: item.productPrice.color,
          capacity: item.productPrice.capacity,
          quantity: item.quantity,
        }));
        setCartItems(fetchedCart);

        const initialSelection = {};
        fetchedCart.forEach(item => {
          initialSelection[item.id] = true;
        });
        setSelectedItems(initialSelection);
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (index, newQuantity) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];

    try {
      await axios.put('http://localhost:8520/cart/update', {
        id: item.id,
        quantity: newQuantity,
      });

      item.quantity = newQuantity;
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  const increaseQuantity = (index) => {
    const newQuantity = cartItems[index].quantity + 1;
    updateQuantity(index, newQuantity);
  };

  const decreaseQuantity = (index) => {
    const currentQuantity = cartItems[index].quantity;
    const newQuantity = currentQuantity - 1;

    if (newQuantity > 0) {
      updateQuantity(index, newQuantity);
    } else {
      removeItem(index);
    }
  };

  const removeItem = async (index) => {
    const itemId = cartItems[index].id;

    try {
      await axios.delete(`http://localhost:8520/cart/delete/${itemId}`);
      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);

      const updatedSelected = { ...selectedItems };
      delete updatedSelected[itemId];
      setSelectedItems(updatedSelected);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8520/cart/deleteAll');
      setCartItems([]);
      setSelectedItems({});
    } catch (error) {
      console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [id]: !prevSelected[id],
    }));
  };

  const handleSelectAll = (checked) => {
    const updatedSelection = {};
    cartItems.forEach(item => {
      updatedSelection[item.id] = checked;
    });
    setSelectedItems(updatedSelection);
  };

  const calculateSubtotal = () =>
      cartItems
          .filter(item => selectedItems[item.id])
          .reduce((total, item) => total + item.price * item.quantity, 0);

  const isCheckoutDisabled = Object.values(selectedItems).every(selected => !selected);

  return (
      <div>
        <Header />
        <div className="cart-container">
          <h1>Giỏ hàng của bạn</h1>
          {loading ? (
              <p>Đang tải...</p>
          ) : cartItems.length === 0 ? (
              <p className="empty-cart">Giỏ hàng trống</p>
          ) : (
              <div>
                <div className="select-all">
                  <input
                      type="checkbox"
                      checked={Object.values(selectedItems).length > 0 && Object.values(selectedItems).every(Boolean)}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label>Chọn tất cả</label>
                </div>

                <ul className="cart-list">
                  {cartItems.map((item, index) => (
                      <li key={item.id} className="cart-item">
                        <input
                            type="checkbox"
                            checked={!!selectedItems[item.id]}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h2>{item.name}</h2>
                          <p>Màu sắc: {item.color}</p>
                          <p>Dung lượng: {item.capacity}</p>
                          <p className="cart-price">{item.price.toLocaleString()}₫</p>

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
                  <button
                      className="checkout"
                      disabled={isCheckoutDisabled}
                      onClick={() =>
                          navigate('/checkout', {
                            state: {
                              selectedItems: cartItems.filter(item => selectedItems[item.id]),
                            },
                          })
                      }
                  >
                    Thanh toán
                  </button>
                </div>

                <div className="cart-summary">
                  <h3>Tổng tiền: {calculateSubtotal().toLocaleString()}₫</h3>
                </div>
              </div>
          )}
        </div>
        <Footer />
      </div>
  );
};

export default Cart;
