import React, { useState } from 'react';
import './Footer.css';


const Footer = () => {
    const supports = [
        {
            description: 'Chính sách và hướng dẫn mua hàng trả góp',
        },
        {
            description: 'Hướng dẫn mua hàng và chính sách vận chuyển',
        },
        {
            description: 'Tra cứu đơn hàng',
        },
        {
            description: 'Chính sách đổi mới và bảo hành',
        },
        {
            description: 'Dịch vụ bảo hành mở rộng',
        },
        {
            description: 'Chính sách bảo mật',
        },
        {
            description: 'Chính sách giải quyết khiếu nại',
        },
        {
            description: 'Quy chế hoạt động',
        },
    ]


    const informations = [
        {
            description: 'Thông tin các trang TMĐT',
        },
        {
            description: 'Chăm sóc khách hàng',
        },
        {
            description: 'Dịch vụ sửa chữa Hoàng Hà Care',
        },
        {
            description: 'Khách hàng doanh nghiệp (B2B)',
        },
        {
            description: 'Tuyển dụng',
        },
        {
            description: 'Tra cứu bảo hành',
        },
    ]

    const payments = [
        {
            name: 'momo',
            img: '/assets/images/payment/momo.png',
        },
        {
            name: 'vnpay',
            img: '/assets/images/payment/vnpay.png',
        },
        {
            name: 'zalopay',
            img: '/assets/images/payment/zalopay.png',
        },
    ]
    const transports = [
        {
            name: 'giao hang nhanh',
            img: '/assets/images/transport/ghn.jpg',
        },
        {
            name: 'j&t express',
            img: '/assets/images/transport/jt.png',
        },
        {
            name: 'viettel post',
            img: '/assets/images/transport/vtpost.png',
        },
    ]
    const contacts = [
        {
            phone: '1900 2805',
        },
    ]
    return (
        <div className="container">
            <div className="grid">
                <div>
                    <h3>Hỗ trợ - dịch vụ</h3>
                    <ul>
                        {supports.map((support, index) => (
                            <li key={index} className="support">{support.description}</li>
                        ))}
                    </ul>

                </div>
                <div>
                    <h3>Thông tin liên hệ</h3>
                    <ul>
                        {informations.map((infor, index) => (
                            <li key={index} className="infor">{infor.description}</li>
                        ))}
                    </ul>

                </div>
                <div className='payment'>
                    <h3>Thanh toán miễn phí</h3>
                    <div className='payment-container'>
                        {payments.map((payment, index) => (
                            <div className="payment-methods" key={index}>
                                <img src={payment.img} alt={payment.name} />
                            </div>

                        ))}
                    </div>
                    <h3 className="mt-4 mb-4">Hình thức vận chuyển</h3>
                    <div className='transport-container'>
                        {transports.map((transport, index) => (
                            <div className="shipping-methods" key={index}>
                                <img src={transport.img} alt={transport.name} />
                            </div>

                        ))}
                    </div>
                </div>
                <div>
                    <div className='contact-container'>
                        <h3>Liên hệ </h3>
                        <div className="contact-info">
                            {contacts.map((contact, index) => (
                                <div className='contact' key={index}>
                                    {contact.phone}
                                </div>

                            ))}
                            <div className="text-sm font-normal">(Từ 8h30 - 21h30)</div>
                        </div>
                        <h3>Kết nối với chúng tôi</h3>
                        <div className="social-icons">
                            <i className="fab fa-tiktok"></i>
                            <i className="fab fa-youtube"></i>
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2020. CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ THƯƠNG MẠI HOÀNG HÀ. MST: 0106713191. (Đăng ký lần đầu: Ngày 15 tháng 12 năm 2014, Đăng ký thay đổi ngày 24/11/2022)</p>
                <p>GP số 426/GP-TTĐT do sở TTTT Hà Nội cấp ngày 22/01/2021</p>
                <p>Địa chỉ: Số 89 Đường Tam Trinh, Phường Mai Động, Quận Hoàng Mai, Thành Phố Hà Nội, Việt Nam. Điện thoại: 1900.2091. Chịu trách nhiệm nội dung: Hoàng Ngọc Minh Tâm.</p>
            </div>
        </div>
    );

};
export default Footer;