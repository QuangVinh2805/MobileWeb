import React, { useState } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
import Header from '../header/Header';
import Category from '../category/Category';
import Banner from '../banner/Banner';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const products = [
        {
            id:1,
            image: "/assets/product/phone/samsung/s23Ultra/1tb/xanhtitan/full.png",
            name: 'Điện thoại 1',
            brand: 'Samsung',
            capacity:'1tb',
            color:'xanh',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:2,
            image: "/assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png",
            name: 'Điện thoại 2',
            brand: 'Samsung',
            capacity:'1tb',
            color:'bạc',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:3,
            image: "/assets/product/phone/samsung/s24Ultra/1tb/dentitan/full.png",
            name: 'Điện thoại 1',
            brand: 'Samsung',
            capacity:'1tb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:4,
            image: "/assets/product/phone/honor/magic6/256gb/den/full.png",
            name: 'Điện thoại 2',
            brand: 'honor',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:5,
            image: "/assets/product/phone/honor/magic7/256gb/den/full.png",
            name: 'Điện thoại 1',
            brand: 'honor',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:6,
            image: "/assets/product/phone/honor/magic7pro/256gb/den/full.png",
            name: 'Điện thoại 2',
            brand: 'honor',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:7,
            image: "/assets/product/phone/iphone/ip14promax/256gb/bac/anhbac1.png",
            name: 'Điện thoại 1',
            brand: 'iphone',
            capacity:'256gb',
            color:'bạc',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:8,
            image: "/assets/product/phone/iphone/ip15promax/256gb/den/anhden1.png",
            name: 'Điện thoại 2',
            brand: 'iphone',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:9,
            image: "/assets/product/phone/iphone/ip14promax/256gb/den/anhden1.png",
            name: 'Điện thoại 1',
            brand: 'iphone',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:10,
            image: "/assets/product/phone/oppo/findn3/256gb/den/full.png",
            name: 'Điện thoại 2',
            brand: 'oppo',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:11,
            image: "/assets/product/phone/oppo/findx7ultra/256gb/den/full.png",
            name: 'Điện thoại 1',
            brand: 'oppo',
            capacity:'256gb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:12,
            image: "/assets/product/phone/vivo/x100Pro/1tb/den/full.png",
            name: 'Điện thoại 2',
            brand: 'vivo',
            capacity:'1tb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:13,
            image: "/assets/product/phone/vivo/x100Ultra/1tb/trang/full.png",
            name: 'Điện thoại 1',
            brand: 'vivo',
            capacity:'1tb',
            color:'trắng',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:14,
            image: "/assets/product/phone/vivo/x200Pro/1tb/den/full.png",
            name: 'Điện thoại 2',
            brand: 'vivo',
            capacity:'1tb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            id:15,
            image: "/assets/product/phone/xiaomi/13Ultra/1tb/den/full.png",
            name: 'Điện thoại 1',
            brand: 'xiaomi',
            capacity:'1tb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            id:16,
            image: "/assets/product/phone/xiaomi/14Ultra/1tb/den/full.png",
            name: 'Điện thoại 1',
            brand: 'xiaomi',
            capacity:'1tb',
            color:'đen',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },

    ];
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
                                <div className='image'>
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <p className="name">{product.name}</p>
                                <p className='brand'>{product.brand}</p>
                                <p className='capacity'>{product.capacity}</p>
                                <p className='color'>{product.color}</p>
                                <p className="text-gray-500">{product.price}</p>
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