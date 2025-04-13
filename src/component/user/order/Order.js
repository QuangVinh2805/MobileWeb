import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Order.css';

import Header from '../header/Header';
import Footer from '../footer/Footer';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:8520/order/get/${userId}`);
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                setOrders([response.data]); // trường hợp trả về 1 đơn
            }
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
        }
    };
    const handleCancelOrder = async (orderId) => {
        const order = orders.find(o => o.order.id === orderId)?.order;

        if (!order) {
            alert("Không tìm thấy đơn hàng.");
            return;
        }
        console.log('Thông tin đơn hàng cần hủy:', order); // Log thông tin đơn hàng cần hủy


        // Sử dụng userId từ localStorage thay vì order.user_id
        const payload = {
            orderId: order.id,
            cartDetailIds: "", // nếu không cần thì để chuỗi rỗng
            userId: userId, // lấy userId từ localStorage
            address: order.address,
            status: 3,
            updatedAt: new Date().toISOString().split('T')[0] // "yyyy-MM-dd"
        };
        console.log('Payload gửi lên server:', payload); // Log payload trước khi gửi đi


        try {
            const response = await axios.put("http://localhost:8520/order/update", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Kết quả từ API sau khi hủy đơn hàng:', response); // Log kết quả từ API

            if (response.status === 200) {
                alert("Đã hủy đơn hàng thành công!");
                fetchOrders(); // Tải lại danh sách đơn hàng
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
        }
    };




    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN');
    };

    return (
        <div>
            <Header />
            <div className="order-container">
                <h1>Lịch sử đơn hàng</h1>
                {orders.length === 0 ? (
                    <p>Bạn chưa có đơn hàng nào.</p>
                ) : (
                    orders.map((orderItem, index) => (
                        <div key={index} className="order-card">
                            <div className="order-info">
                                <p>Ngày đặt: {formatDate(orderItem.createdAt)}</p>
                                <p>Địa chỉ nhận hàng: {orderItem.order.address}</p>
                                <p>
                                    Trạng thái: {
                                    orderItem.order.status === 0 ? 'Chờ xác nhận' :
                                        orderItem.order.status === 1 ? 'Đang giao hàng' :
                                            orderItem.order.status === 2 ? 'Đã giao' :
                                                'Đã hủy'
                                }
                                </p>
                                {orderItem.order.status === 0 && (
                                    <button className="cancel-order-btn"
                                            onClick={() => handleCancelOrder(orderItem.order.id)}>
                                        Hủy đơn hàng
                                    </button>
                                )}
                            </div>

                            <div className="order-product">
                                <img
                                    src={orderItem.product.avatar}
                                    alt={orderItem.product.productName}
                                    className="order-product-image"
                                />
                                <div className="order-product-info">
                                    <p><strong>{orderItem.product.productName}</strong></p>
                                    <p>Màu: {orderItem.productPrice.color} - Dung
                                        lượng: {orderItem.productPrice.capacity}</p>
                                    <p>Giá: {formatCurrency(orderItem.productPrice.price)}</p>
                                    <p>Số Lượng: {orderItem.quantity}</p>
                                    <p><strong>Tổng Tiền: {formatCurrency(orderItem.totalPrice)}</strong></p>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Order;
