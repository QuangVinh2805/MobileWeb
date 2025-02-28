import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const goToCart = () => {
        navigate('/cart');
    };
    const goToHome = () => {
        navigate('/');
    }
    return (
        <div>
            <header>
                <div className="left">
                    <span>SẢN PHẨM CHÍNH HÃNG</span>
                    <span>CAM KẾT LỖI ĐỔI LIỀN (*)</span>
                    <span>HOTLINE 1900.2091</span>
                    <span>MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC</span>
                </div>
            </header>
            <div className="search-bar">
                <div className="left">
                    <h1 className='NameStore'onClick={goToHome}>VPhone</h1>
                    <input type="text" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="right">
                    <i className="fas fa-user text-500"></i>
                    <span>Tài khoản</span>
                    <i className="fas fa-shopping-cart text-500" onClick={goToCart} style={{cursor:'pointer'}}></i>
                </div>
            </div>
            </div>
            );
};
export default Header;