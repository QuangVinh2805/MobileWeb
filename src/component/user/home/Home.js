
import React, { useState, useEffect } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../header/Header';
import Category from '../category/Category';
import Banner from '../banner/Banner';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaMicrochip, FaBatteryFull, FaMemory } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8520/product/all')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => console.error('Lỗi khi tải sản phẩm:', error));
    }, []);

    const handleProductClick = async (product) => {
        try {
            // Gọi API lấy danh sách màu sắc của sản phẩm
            const colorResponse = await fetch(`http://localhost:8520/product/image/colors?productId=${product.id}`);
            const colors = await colorResponse.json();

            let selectedColor = null;
            let images = [];

            if (colors.length > 0) {
                selectedColor = colors[0].color; // Lấy tên màu

                // Gọi API lấy danh sách hình ảnh theo màu đầu tiên
                const imageResponse = await fetch(`http://localhost:8520/product/image/allImage?product_id=${product.id}&color=${selectedColor}`); // Sửa tham số ở đây
                images = await imageResponse.json();
            }

            // Gọi API lấy danh sách dung lượng
            const capacityResponse = await fetch(`http://localhost:8520/product/capacity?productId=${product.id}`);
            const capacities = await capacityResponse.json();
            const selectedCapacity = capacities.length > 0 ? capacities[0] : null;

            // Chuyển sang trang Product với dữ liệu đã xử lý
            navigate(`/product/${product.id}`, {
                state: {
                    product,
                    colors,
                    images,
                    selectedColor,
                    capacities,
                    selectedCapacity
                }
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        }
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
                                    <img src={product.avatar} alt={product.productName} />
                                </div>
                                <div className="info">
                                    <p className="name">{product.productName}</p>
                                    <p className="price">{`Giá: ${product.price} VNĐ`}</p>
                                </div>
                                <div className="specifications">
                                    <p><FaMicrochip /> {product.microprocessor}</p>
                                    <p><FaBatteryFull /> {product.batteryCapacity} mAh</p>
                                    <p><FaMemory /> {product.ram}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Home;

