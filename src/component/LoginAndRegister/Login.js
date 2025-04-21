import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';
import axiosClient from '../api/api';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleLogin = async (event) => {
        event.preventDefault();

        // Kiểm tra nếu tài khoản hoặc mật khẩu trống
        if (!username || !password) {
            setErrorMessage("Tài khoản và mật khẩu không được để trống");
            return;
        }

        try {
            const response = await fetch('http://localhost:8520/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Phản hồi từ BE:", data);

            // Kiểm tra nếu BE trả về lỗi (HTTP 4xx, 5xx)
            if (!response.ok) {
                setErrorMessage(data.message || "Sai tài khoản hoặc mật khẩu.");
                return;
            }

            // Nếu đăng nhập thành công, lưu thông tin vào localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userId', data.id); // Lưu userId để dùng sau này

            // Điều hướng đến trang phù hợp
            if (data.roleId === 1) {
                navigate("/admin/manageProduct");
            } else {
                const redirectUrl = localStorage.getItem("redirectAfterLogin");
                if (redirectUrl) {
                    navigate(redirectUrl);
                    localStorage.removeItem("redirectAfterLogin"); // Xóa sau khi dùng
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại sau.");
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    return (

        <div className="login-container">
            <div className="login-form-container">
                <h1 className='NameStoreLogin' onClick={goToHome}>VPhone</h1>
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Tài khoản</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tài khoản"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>
                <div className="signup-link">
                    <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
