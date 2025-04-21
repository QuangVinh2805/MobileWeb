import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/api';
import './Profile.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Profile = () => {
    const userId = localStorage.getItem('userId'); // ✅ Lấy userId từ localStorage
    const [user, setUser] = useState({
        id: '',
        username: '',
        password: '',
        birthday: '',
        name: '',
        address: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (userId) {
            axiosClient.get(`/user/${userId}`)
                .then(res => {
                    const { roleId, ...userData } = res.data;
                    setUser(userData);
                })
                .catch(err => console.error('Error loading user:', err));
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = { ...user };
        axiosClient.put('/user/update', updatedUser)
            .then(() => alert('Cập nhật thành công'))
            .catch(err => {
                console.error('Update failed:', err);
                alert('Cập nhật thất bại');
            });
    };

    return (
        <div>
            <Header/>
        <div className="profile-container">
            <h1>Thông tin cá nhân</h1>
            <form onSubmit={handleSubmit} className="profile-form">
                <label>Họ tên:
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                </label>

                <label>Tên đăng nhập:
                    <input type="text" name="username" value={user.username} onChange={handleChange} />
                </label>

                <label>Mật khẩu:
                    <input type="text" name="password" value={user.password} onChange={handleChange} />
                </label>

                <label>Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                </label>

                <label>Số điện thoại:
                    <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
                </label>

                <label>Địa chỉ:
                    <input type="text" name="address" value={user.address} onChange={handleChange} />
                </label>

                <label>Ngày sinh:
                    <input type="date" name="birthday" value={user.birthday.slice(0, 10)} onChange={handleChange} />
                </label>

                <button type="submit">Cập nhật</button>
            </form>

        </div>
            <Footer/>
        </div>
    );
};

export default Profile;
