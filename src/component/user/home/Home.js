import React, { useState, useEffect } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../header/Header';
import Category from '../category/Category';
import Banner from '../banner/Banner';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8520/product/all')
            .then((response) => response.json())
            .then((data) => {
                // Gọi API oneImage cho từng sản phẩm để lấy hình ảnh
                const updatedProducts = data.map(async (product) => {
                    const imageResponse = await fetch(`http://localhost:8520/product/image/oneImage?id=${product.id}`);
                    const imageData = await imageResponse.json();
                    return { ...product, image: imageData[0] }; // Giả sử API trả về một mảng chứa URL ảnh
                });

                Promise.all(updatedProducts).then((finalProducts) => setProducts(finalProducts));
            })
            .catch((error) => console.error('Lỗi khi tải sản phẩm:', error));
    }, []);

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    return (
        <div>
            <Header />
            <div className="main-content">
                <Category />
                <main>
                    <Banner />
                    <div className="product-list">
                        {products.map((product) => (
                            <div className="product-item" key={product.id} onClick={() => handleProductClick(product)}>
                                <div className="image">
                                    <img src={product.image} alt={product.productName} />
                                </div>
                                <p className="name">{product.productName}</p>
                                <p className="brand">{product.brand}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <div className="chat-button">
                <i className="fas fa-comments"></i>
                <span>CHAT NGAY</span>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
