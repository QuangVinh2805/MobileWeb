import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product_Detail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faTruck,
    faShieldAlt,
    faSyncAlt,
    faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, colors = [], images = [], selectedColor } =
    location.state || {};

    const [selectedImage, setSelectedImage] = useState(
        images.length > 0 ? images[0].image : ''
    );
    const [availableColors, setAvailableColors] = useState(colors);
    const [currentColor, setCurrentColor] = useState(selectedColor);
    const [imageList, setImageList] = useState(images);
    const [capacities, setCapacities] = useState([]);
    const [selectedCapacity, setSelectedCapacity] = useState(null);
    const [price, setPrice] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [productPriceId, setProductPriceId] = useState(null);


    useEffect(() => {
        if (product) {
            if (availableColors.length === 0) {
                fetchColors(product.id);
            }
            fetchCapacities(product.id);
            fetchProductDetails(product.id);
        }
    }, [product]);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await axios.get(
                `http://localhost:8520/product/detail?productId=${productId}`
            );
            setProductDetails(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy thông số chi tiết sản phẩm:', error);
        }
    };

    const fetchColors = async (productId) => {
        try {
            const response = await axios.get(
                `http://localhost:8520/product/image/colors?productId=${productId}`
            );
            const fetchedColors = response.data || [];
            setAvailableColors(fetchedColors);

            if (fetchedColors.length > 0) {
                setCurrentColor(fetchedColors[0].color);
                fetchImages(productId, fetchedColors[0].color);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách màu:', error);
        }
    };

    const handleColorChange = (color) => {
        setCurrentColor(color);
        fetchImages(product.id, color);
        fetchCapacities(product.id, color);
    };

    const fetchImages = async (productId, color) => {
        try {
            const response = await axios.get(
                `http://localhost:8520/product/image/allImage?product_id=${productId}&color=${color}`
            );
            const imagesData = response.data || [];
            setImageList(imagesData);
            if (imagesData.length > 0) {
                setSelectedImage(imagesData[0].image);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ảnh:', error);
        }
    };

    const fetchCapacities = async (productId) => {
        try {
            const response = await axios.get(
                `http://localhost:8520/product/capacity?productId=${productId}`
            );
            setCapacities(response.data || []);
            if (response.data.length > 0) {
                setSelectedCapacity(response.data[0]);
                fetchPrice(product.id, currentColor, response.data[0]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách dung lượng:', error);
        }
    };

    const fetchPrice = async (productId, color, capacity) => {
        try {
            const response = await axios.get(
                `http://localhost:8520/product/price?productId=${productId}&color=${color}&capacity=${capacity}`
            );
            if (response.data) {
                setPrice(response.data.price);
                setProductPriceId(response.data.productPriceId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy giá sản phẩm:', error);
        }
    };

    const handleCapacityChange = (capacity) => {
        setSelectedCapacity(capacity);
        fetchPrice(product.id, currentColor, capacity);
    };

    const addToCart = async () => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
            return;
        }

        if (!product || !currentColor || !selectedCapacity || !price) {
            alert("Không đủ thông tin để thêm vào giỏ hàng");
            return;
        }

        try {
            // Lấy productPriceId từ API
            const response = await axios.get(
                `http://localhost:8520/product/price?productId=${product.id}&color=${currentColor}&capacity=${selectedCapacity}`
            );

            const productPriceData = response.data;

            if (!productPriceData || !productPriceData.id) {
                alert("Không tìm thấy thông tin giá sản phẩm tương ứng.");
                return;
            }

            const cartRequest = {
                productId: product.id,
                productPriceId: productPriceData.id,
                userId: Number(userId),
                quantity: 1,
            };

            const addCartResponse = await axios.post(
                "http://localhost:8520/cart/create",
                cartRequest
            );

            if (addCartResponse.status === 200) {
                alert("✅ Sản phẩm đã được thêm vào giỏ hàng");
            } else {
                alert("❌ Có lỗi xảy ra. Status: " + addCartResponse.status);
            }
        } catch (error) {
            console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            alert("❌ Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        }
    };




    if (!product) {
        return <p className="error-message">Sản phẩm không tồn tại</p>;
    }

    return (
        <div>
            <Header />
            <div className="container-product">
                <button className="product-detail-back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faChevronLeft} /> Quay lại
                </button>
                <div className="product-detail-product-layout">
                    <div className="product-detail-product-images">
                        <div className="product-detail-image-main">
                            <img src={selectedImage} alt={product.productName} />
                        </div>
                        <div className="product-detail-image-thumbnails">
                            {imageList.length > 0 ? (
                                imageList.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img.image}
                                        alt={`Thumbnail ${index}`}
                                        onClick={() => setSelectedImage(img.image)}
                                    />
                                ))
                            ) : (
                                <p>Không có hình ảnh khác</p>
                            )}
                        </div>
                    </div>
                    <div className="product-detail-product-details">
                        <div className="product-detail-price-info">
                            <h3>Giá:</h3>
                            <span className="current-price">
                {price ? `${price} VNĐ` : 'Đang cập nhật...'}
              </span>
                        </div>
                        <div className="product-detail-color-options">
                            <h2>Màu sắc</h2>
                            <div className="product-detail-color-buttons">
                                {availableColors.map((colorItem, index) => (
                                    <button
                                        key={index}
                                        className={
                                            currentColor === colorItem.color
                                                ? 'color-button selected'
                                                : 'color-button'
                                        }
                                        onClick={() => handleColorChange(colorItem.color)}
                                    >
                                        {colorItem.color}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="product-detail-capacity-options">
                            <h2>Phiên bản</h2>
                            <div className="product-detail-capacity-buttons">
                                {capacities.map((capacity, index) => (
                                    <button
                                        key={index}
                                        className={
                                            selectedCapacity === capacity
                                                ? 'capacity-button selected'
                                                : 'capacity-button'
                                        }
                                        onClick={() => handleCapacityChange(capacity)}
                                    >
                                        {capacity}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="product-detail-feature-list">
                            {[
                                { icon: faTruck, text: 'Miễn phí vận chuyển toàn quốc' },
                                { icon: faShieldAlt, text: 'Bảo hành 12 tháng chính hãng' },
                                { icon: faSyncAlt, text: 'Bao xài đổi lỗi 30 ngày đầu' },
                                { icon: faReceipt, text: 'Giá đã bao gồm VAT' },
                            ].map((item, index) => (
                                <div key={index} className="feature-item">
                                    <FontAwesomeIcon icon={item.icon} />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="product-detail-purchase-buttons">
                            <button className="buy-now">MUA NGAY</button>
                            <button className="add-to-cart" onClick={addToCart}>
                                Thêm giỏ hàng
                            </button>
                        </div>
                        <div className="product-detail-product-specifications">
                            <h2>Thông số chi tiết</h2>
                            {productDetails ? (
                                <ul>
                                    {Object.entries(productDetails).map(
                                        ([key, value], index) => {
                                            if (
                                                key === 'id' ||
                                                key === 'description' ||
                                                key === 'createdAt' ||
                                                key === 'updatedAt'
                                            )
                                                return null;

                                            let vietnameseKey;
                                            switch (key) {
                                                case 'screen':
                                                    vietnameseKey = 'Màn hình';
                                                    break;
                                                case 'frequency':
                                                    vietnameseKey = 'Tần số';
                                                    break;
                                                case 'resolution':
                                                    vietnameseKey = 'Độ phân giải';
                                                    break;
                                                case 'screenSize':
                                                    vietnameseKey = 'Kích thước màn hình';
                                                    break;
                                                case 'screenBrightness':
                                                    vietnameseKey = 'Độ sáng màn hình';
                                                    break;
                                                case 'rearCameraResolution':
                                                    vietnameseKey = 'Độ phân giải camera sau';
                                                    break;
                                                case 'rearCameraFeature':
                                                    vietnameseKey = 'Tính năng camera sau';
                                                    break;
                                                case 'flash':
                                                    vietnameseKey = 'Đèn flash';
                                                    break;
                                                case 'frontCameraResolution':
                                                    vietnameseKey = 'Độ phân giải camera trước';
                                                    break;
                                                case 'microprocessor':
                                                    vietnameseKey = 'Vi xử lý';
                                                    break;
                                                case 'cpuSpeed':
                                                    vietnameseKey = 'Tốc độ CPU';
                                                    break;
                                                case 'graphicsProcessor':
                                                    vietnameseKey = 'Bộ xử lý đồ họa';
                                                    break;
                                                case 'operatingSystem':
                                                    vietnameseKey = 'Hệ điều hành';
                                                    break;
                                                case 'externalMemoryCard':
                                                    vietnameseKey = 'Thẻ nhớ ngoài';
                                                    break;
                                                case 'ram':
                                                    vietnameseKey = 'RAM';
                                                    break;
                                                case 'network':
                                                    vietnameseKey = 'Mạng';
                                                    break;
                                                case 'simSlot':
                                                    vietnameseKey = 'Khe SIM';
                                                    break;
                                                case 'wifi':
                                                    vietnameseKey = 'Wi-Fi';
                                                    break;
                                                case 'positioning':
                                                    vietnameseKey = 'Định vị';
                                                    break;
                                                case 'bluetooth':
                                                    vietnameseKey = 'Bluetooth';
                                                    break;
                                                case 'jackEarphone':
                                                    vietnameseKey = 'Jack tai nghe';
                                                    break;
                                                case 'charger':
                                                    vietnameseKey = 'Sạc';
                                                    break;
                                                case 'sensor':
                                                    vietnameseKey = 'Cảm biến';
                                                    break;
                                                case 'size':
                                                    vietnameseKey = 'Kích thước';
                                                    break;
                                                case 'weight':
                                                    vietnameseKey = 'Trọng lượng';
                                                    break;
                                                case 'material':
                                                    vietnameseKey = 'Chất liệu';
                                                    break;
                                                case 'design':
                                                    vietnameseKey = 'Thiết kế';
                                                    break;
                                                case 'batteryCapacity':
                                                    vietnameseKey = 'Dung lượng pin(mAh)';
                                                    break;
                                                case 'batteryTechnology':
                                                    vietnameseKey = 'Công nghệ pin';
                                                    break;
                                                case 'batteryType':
                                                    vietnameseKey = 'Loại pin';
                                                    break;
                                                case 'maximumCharge':
                                                    vietnameseKey = 'Sạc tối đa';
                                                    break;
                                                case 'specialFeatures':
                                                    vietnameseKey = 'Tính năng đặc biệt';
                                                    break;
                                                case 'security':
                                                    vietnameseKey = 'Bảo mật';
                                                    break;
                                                case 'resistant':
                                                    vietnameseKey = 'Chống nước';
                                                    break;
                                                case 'launchTime':
                                                    vietnameseKey = 'Ngày ra mắt';
                                                    break;
                                                default:
                                                    vietnameseKey = key;
                                            }

                                            return (
                                                <li key={index}>
                                                    <strong>{vietnameseKey}:</strong> {value}
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            ) : (
                                <p>Đang tải thông số chi tiết...</p>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
            <Footer />
        </div>
    );
};

export default Product;