import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Product_Category.css';
import { FaMicrochip, FaBatteryFull, FaMemory } from 'react-icons/fa';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import axiosClient from '../../api/api';

const Product_Category = () => {
    const { categoryDetailId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const categoryDetailName = location.state?.categoryDetailName || '';

    useEffect(() => {
        axiosClient.get(`/product/byCategoryDetail/${categoryDetailId}`)
            .then(response => {
                setProducts(response.data || []);
            })
            .catch(error => {
                console.error('Lỗi khi lấy sản phẩm theo category detail:', error);
                setProducts([]); // Set to empty array on error
            });
    }, [categoryDetailId]);

    const handleProductClick = async (product) => {
        try {
            const colorResponse = await axiosClient.get(`/product/image/colors?productId=${product.id}`);
            const colors = colorResponse.data;

            let selectedColor = null;
            let images = [];

            if (colors.length > 0) {
                selectedColor = colors[0].color;

                const imageResponse = await axiosClient.get(`/product/image/allImage?product_id=${product.id}&color=${selectedColor}`);
                images = imageResponse.data;
            }

            const capacityResponse = await axiosClient.get(`/product/capacity?productId=${product.id}`);
            const capacities = capacityResponse.data;
            const selectedCapacity = capacities.length > 0 ? capacities[0] : null;

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
            console.error('Lỗi khi xử lý dữ liệu sản phẩm:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <Header/>
            <div className="buton">
            <button className="product-cate-back-button" onClick={handleBack}>← Quay lại</button>
            </div>
            <div className="product-cate-product-page">
                <div className="product-cate-product-list">
                    {Array.isArray(products) && products.length > 0 ? (
                        products
                            .filter(p => p.status === 1)
                            .map((product) => (
                                <div className="product-cate-product-item" key={product.id}
                                     onClick={() => handleProductClick(product)}>
                                    <div className="product-cate-image">
                                        <img src={product.avatar} alt={product.productName}/>
                                    </div>
                                    <div className="product-cate-info">
                                        <p className="name">{product.productName}</p>
                                        <p className="price">Giá: {product.price} VNĐ</p>
                                    </div>
                                    <div className="product-cate-specifications">
                                        <p><FaMicrochip/> {product.microprocessor}</p>
                                        <p><FaBatteryFull/> {product.batteryCapacity} mAh</p>
                                        <p><FaMemory/> {product.ram}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p>Không có sản phẩm nào trong danh mục này.</p>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Product_Category;
