import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTruck, faShieldAlt, faSyncAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [selectedImage, setSelectedImage] = useState(product ? product.image : '');
  if (!product) {
    return <p className="error-message">Sản phẩm không tồn tại</p>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Sản phẩm đã được thêm vào giỏ hàng');
  };


  return (
    <div>
      <Header />
      <div className="container-product">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
        </button>
        {/* <h1 className="title">{product.name}</h1> */}
        <div className="product-layout">
          <div className="product-images">
            <div className="image-main">
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className="image-thumbnails">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <img key={index} src={img} alt={`Thumbnail ${index}`} onClick={() => setSelectedImage(img)} />
                ))
              ) : (
                <p>Không có hình ảnh khác</p>
              )}
            </div>
          </div>
          <div className="product-details">
            <div className="price-info">
              <span className="current-price">{product.price}</span>
              {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
            </div>
            <div className="capacity-options">
              <h2>Phiên bản</h2>
              <div className="capacity-info">
                <span className="capacity-product">{product.capacity}</span>
              </div>
            </div>
            <div className="color-options">
              <h2>Màu sắc</h2>
              <div className="color-info">
                <span className="color-product">{product.color}</span>
              </div>
            </div>
            <div className="feature-list">
              {[{ icon: faTruck, text: 'Miễn phí vận chuyển toàn quốc' },
              { icon: faShieldAlt, text: 'Bảo hành 12 tháng chính hãng' },
              { icon: faSyncAlt, text: 'Bao xài đổi lỗi 30 ngày đầu' },
              { icon: faReceipt, text: 'Giá đã bao gồm VAT' }].map((item, index) => (
                <div key={index} className="feature-item">
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="purchase-buttons">
              <button className="buy-now">MUA NGAY</button>
              <button className="add-to-cart" onClick={addToCart}>Thêm giỏ hàng</button>

            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Product;