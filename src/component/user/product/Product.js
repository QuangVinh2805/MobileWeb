import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Product.css';
import { FaMicrochip, FaBatteryFull, FaMemory } from 'react-icons/fa';
import Category_Detail from '../category_detail/Category_Detail';
import Footer from '../footer/Footer';
import Header from '../header/Header';

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { category, products } = location.state || {};

    return (
        <div>
            <Header/>
        <div className="product-product-page">
            <div className="product-content-right">

            {/* Nút quay lại */}
            <button className="product-back-button" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <div className="product-product-list">
                {Array.isArray(products) && products.length > 0 ? (
                    products
                        .filter(p => p.status === 1)
                        .map((product) => (
                            <div
                                className="product-product-item"
                                key={product.id}
                                onClick={() => navigate(`/product_detail/${product.id}`, {
                                    state: { product }
                                })}
                            >
                                <div className="image-product">
                                    <img src={product.avatar} alt={product.productName} />
                                </div>
                                <div className="product-info">
                                    <p className="name">{product.productName}</p>
                                    <p className="price">Giá: {product.price} VNĐ</p>
                                </div>
                                <div className="product-specifications">
                                    <p><FaMicrochip /> {product.microprocessor}</p>
                                    <p><FaBatteryFull /> {product.batteryCapacity} mAh</p>
                                    <p><FaMemory /> {product.ram}</p>
                                </div>
                            </div>
                        ))
                ) : (
                    <p>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </div>
            </div>
        </div>
            <Category_Detail />
            <Footer/>
        </div>
    );
};

export default Product;
