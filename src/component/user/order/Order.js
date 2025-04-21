import React, { useEffect, useState } from 'react';
import './Order.css';

import Header from '../header/Header';
import Footer from '../footer/Footer';
import axiosClient from '../../api/api';

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
            const response = await axiosClient.get(`/order/get/${userId}`);
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                setOrders([response.data]); // trường hợp trả về 1 đơn
            }
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const handleCancelOrder = async (orderItem) => {
        const order = orderItem.order;

        if (!order || !orderItem.id) {
            alert("Không tìm thấy đơn hàng.");
            return;
        }

        const payload = {
            userId: Number(userId),
            orderDetailId: orderItem.id,
            status: 3,
            address: order.address
        };

        console.log('Payload gửi lên server:', payload);

        try {
            const response = await axiosClient.put("/order/update", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert("Đã hủy đơn hàng thành công!");
                fetchOrders(); // Tải lại danh sách
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
                                    orderItem.status === 0 ? 'Chờ xác nhận' :
                                        orderItem.status === 1 ? 'Đang giao hàng' :
                                            orderItem.status === 2 ? 'Đã giao' :
                                                'Đã hủy'
                                }
                                </p>
                                {orderItem.status === 0 && (
                                    <button className="cancel-order-btn"
                                            onClick={() => handleCancelOrder(orderItem)}>
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
