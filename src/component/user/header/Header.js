import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();

    // State lưu thông tin người dùng
    const [user, setUser] = useState(null);

    // Lấy dữ liệu người dùng từ localStorage khi component được render
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const goToCart = () => {
        navigate('/cart');
    };

    const goToHome = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate(user ? '/profile' : '/login');
    };

    const handleLogout = () => {
        // Xóa thông tin người dùng khi đăng xuất
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        setUser(null); // Cập nhật lại state
        navigate('/login');
    };

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
                    <h1 className='NameStore' onClick={goToHome}>VPhone</h1>
                    <input type="text" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="right">
                    <div className="icon-links">
                        {user ? (
                            <>
                                <FaUserCircle
                                    size={24}
                                    style={{cursor: 'pointer', marginRight: '20px'}}
                                    onClick={handleProfileClick}
                                />
                                <FaShoppingCart
                                    size={24}
                                    style={{cursor: 'pointer'}}
                                    onClick={goToCart}
                                />
                                <button onClick={handleLogout} className='logout' style={{
                                    width:'100px',
                                    borderRadius: '5px',
                                    color: '#ffffff',
                                    background: '#38b2ac',
                                    marginLeft: '20px',
                                    border: 'solid #38b2ac'
                                }}>Đăng xuất
                                </button>
                            </>
                        ) : (
                            <FaUserCircle
                                size={24}
                                style={{cursor: 'pointer', marginRight: '20px'}}
                                onClick={handleProfileClick}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
