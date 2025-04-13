import React, { useState, useEffect } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../header/Header';
import Category from '../category/Category';
import Banner from '../banner/Banner';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaMicrochip, FaBatteryFull, FaMemory, FaEyeSlash, FaEye } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const fetchProducts = () => {
        fetch('http://localhost:8520/product/all')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data || []); // Ensure products is always an array
            })
            .catch((error) => {
                console.error('Lỗi khi tải sản phẩm:', error);
                setProducts([]); // Set to empty array on error
            });
    };


    useEffect(() => {
        fetchProducts(); // Gọi API để lấy danh sách sản phẩm khi component được render
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
                const imageResponse = await fetch(`http://localhost:8520/product/image/allImage?product_id=${product.id}&color=${selectedColor}`);
                images = await imageResponse.json();
            }

            // Gọi API lấy danh sách dung lượng
            const capacityResponse = await fetch(`http://localhost:8520/product/capacity?productId=${product.id}`);
            const capacities = await capacityResponse.json();
            const selectedCapacity = capacities.length > 0 ? capacities[0] : null;

            // Chuyển sang trang Product với dữ liệu đã xử lý
            navigate(`/product_detail/${product.id}`, {
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
                    <Banner/>
                    <div className="home-product-list">
                        {Array.isArray(products) && products
                            .filter((product) => product.status === 1)
                            .map((product) => (
                                <div className="home-product-item" key={product.id} onClick={() => handleProductClick(product)}>
                                    <div className="home-image">
                                        <img src={product.avatar} alt={product.productName} />
                                    </div>
                                    <div className="home-info">
                                        <p className="name">{product.productName}</p>
                                        <p className="price">{`Giá: ${product.price} VNĐ`}</p>
                                    </div>
                                    <div className="home-specifications">
                                        <p><FaMicrochip /> {product.microprocessor}</p>
                                        <p><FaBatteryFull /> {product.batteryCapacity} mAh</p>
                                        <p><FaMemory /> {product.ram}</p>
                                    </div>
                                </div>
                            ))}

                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;