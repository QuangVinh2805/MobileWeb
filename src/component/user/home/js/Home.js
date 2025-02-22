import React, { useState } from 'react';
import '../css/Home.css';
import Dt1 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/dentitan/full.png"
import Dt2 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt3 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt4 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt5 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt6 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt7 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt8 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt9 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt10 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt11 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt12 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt13 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt14 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt15 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import Dt16 from "../../../../assets/product/phone/samsung/s25Ultra/1tb/bactitan/full.png"
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = [
        {
            image: Dt1,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt2,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        // Thêm sản phẩm khác vào đây
    ];
    const products = [
        {
            image: Dt1,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt2,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt3,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt4,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt5,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt6,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt7,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt8,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt9,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt10,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt11,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt12,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt13,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt14,
            name: 'Điện thoại 2',
            description: 'Đây là mô tả về điện thoại 2',
            price: '15.000.000đ',
        },
        {
            image: Dt15,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },
        {
            image: Dt16,
            name: 'Điện thoại 1',
            description: 'Đây là mô tả về điện thoại 1',
            price: '10.000.000đ',
        },

    ];

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % banners.length);
    };

    const handlePrev = () => {
        setCurrentIndex((currentIndex - 1 + banners.length) % banners.length);
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
                    <h1 className='NameStore'>VPhone</h1>
                    <input type="text" placeholder="Hôm nay bạn muốn tìm kiếm gì?" />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="right">
                    <i className="fas fa-user text-green-500"></i>
                    <span>Tài khoản</span>
                    <i className="fas fa-shopping-cart text-green-500"></i>
                    <span>0</span>
                </div>
            </div>
            <div className="main-content">
                <div className='aside'>
                    <ul>
                        <li>
                            <span>Danh mục</span>
                        </li>
                        <li>
                            <i className="fas fa-mobile-alt" height="30" width="30"></i>
                            <span>Điện thoại</span>
                        </li>
                        <li>
                            <i className="fas fa-laptop" height="30" width="30"></i>
                            <span>Laptop</span>
                        </li>
                        <li>
                            <i className="fas fa-tablet-alt" height="30" width="30"></i>
                            <span>Tablet</span>
                        </li>
                        <li>
                            <i className="fas fa-desktop" height="30" width="30"></i>
                            <span>Màn hình</span>
                        </li>
                        <li>
                            <i className="fas fa-cogs" height="30" width="30"></i>
                            <span>Điện máy</span>
                        </li>
                        <li>
                            <i className="fas fa-clock" height="30" width="30"></i>
                            <span>Đồng hồ</span>
                        </li>
                        <li>
                            <i className="fas fa-volume-up" height="30" width="30"></i>
                            <span>Âm thanh</span>
                        </li>
                        <li>
                            <i className="fas fa-home" height="30" width="30"></i>
                            <span>Smart home</span>
                        </li>
                        <li>
                            <i className="fas fa-cogs" height="30" width="30"></i>
                            <span>Phụ kiện</span>
                        </li>
                        <li>
                            <i className="fas fa-tools" height="30" width="30"></i>
                            <span>Sửa chữa</span>
                        </li>
                    </ul>
                </div>
                <main>

                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {banners.map((product, index) => (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                    <div className="product-highlight">
                                        <div className="phone-image">
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                        <div className="phone-description">
                                            <h2>{product.name}</h2>
                                            <p>{product.description}</p>
                                            <p>Giá: {product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" onClick={handlePrev}>
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" onClick={handleNext}>
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                    <div className="product-list">
                        {products.map((product, index) => (
                            <div className="product-item" key={index}>
                                <img src={product.image} alt={product.name} height="100" width="150" />
                                <p className="price">{product.name}</p>
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
            <div className="container">
                <div className="grid">
                    <div>
                        <ul>
                            <h3>Hỗ trợ - dịch vụ</h3>
                            <li>Chính sách và hướng dẫn mua hàng trả góp</li>
                            <li>Hướng dẫn mua hàng và chính sách vận chuyển</li>
                            <li>Tra cứu đơn hàng</li>
                            <li>Chính sách đổi mới và bảo hành</li>
                            <li>Dịch vụ bảo hành mở rộng</li>
                            <li>Chính sách bảo mật</li>
                            <li>Chính sách giải quyết khiếu nại</li>
                            <li>Quy chế hoạt động</li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <h3>Thông tin liên hệ</h3>
                            <li>Thông tin các trang TMĐT</li>
                            <li>Chăm sóc khách hàng</li>
                            <li>Dịch vụ sửa chữa Hoàng Hà Care</li>
                            <li>Khách hàng doanh nghiệp (B2B)</li>
                            <li>Tuyển dụng</li>
                            <li>Tra cứu bảo hành</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Thanh toán miễn phí</h3>
                        <div className="payment-methods">
                            <img src="https://storage.googleapis.com/a1aa/image/UGvzyTGnwtNelGipe4odRuvj0C21c1Vl_po5YHxwXBE.jpg" alt="Visa logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/eNlB6QyaHNw6ima29ei7-kn0PcQiZuGVUC5hbeQ2AzY.jpg" alt="Mastercard logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/qaQAH26jJ3_iuJT38GgIBVKXE35OqCaDRCS2WE5J20Y.jpg" alt="Samsung Pay logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/MsRvZFvd-NAKU7NR3PqVH8L0v7CGSRbsIJpKApqa_EY.jpg" alt="VNPay QR logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/J4dUkJKBtIIAN3QHykTITzNlbbWtXXvVXM1FVoJbh6Q.jpg" alt="ZaloPay logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/luWBjZaDYPL7jDm7LxEAR23OfL2u7_RzdmzowGD4cWI.jpg" alt="Apple Pay logo" />
                        </div>
                        <h3 className="mt-4 mb-4">Hình thức vận chuyển</h3>
                        <div className="shipping-methods">
                            <img src="https://storage.googleapis.com/a1aa/image/edvFRpQEFpgSrfxfym0NmQWpi5_tXB6UGz-0bC0aK1o.jpg" alt="Nhất Tín Logistics logo" />
                            <img src="https://storage.googleapis.com/a1aa/image/5adoHfeWluh9lWnDHztX5a0hIoKLBmcKC8FE55PITWc.jpg" alt="Vietnam Post logo" />
                        </div>
                    </div>
                    <div>
                        <h3>Tổng đài</h3>
                        <div className="contact-info">
                            1900.2091
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
                        <div className="mt-4">
                            <img src="https://storage.googleapis.com/a1aa/image/gs1xmScj8h0ymG5ajXe4Ue3pv-g_H9CdoO3qhpxw6f4.jpg" alt="Đã thông báo Bộ Công Thương logo" width="120" height="40" />
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2020. CÔNG TY CỔ PHẦN XÂY DỰNG VÀ ĐẦU TƯ THƯƠNG MẠI HOÀNG HÀ. MST: 0106713191. (Đăng ký lần đầu: Ngày 15 tháng 12 năm 2014, Đăng ký thay đổi ngày 24/11/2022)</p>
                    <p>GP số 426/GP-TTĐT do sở TTTT Hà Nội cấp ngày 22/01/2021</p>
                    <p>Địa chỉ: Số 89 Đường Tam Trinh, Phường Mai Động, Quận Hoàng Mai, Thành Phố Hà Nội, Việt Nam. Điện thoại: 1900.2091. Chịu trách nhiệm nội dung: Hoàng Ngọc Minh Tâm.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;