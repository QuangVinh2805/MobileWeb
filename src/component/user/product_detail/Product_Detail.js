import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/api';
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
    const { product, colors = [], images = [], selectedColor } = location.state || {};

    // STATES
    const [selectedImage, setSelectedImage] = useState(images.length > 0 ? images[0].image : '');
    const [availableColors, setAvailableColors] = useState(colors);
    const [currentColor, setCurrentColor] = useState(selectedColor);
    const [imageList, setImageList] = useState(images);
    const [capacities, setCapacities] = useState([]);
    const [selectedCapacity, setSelectedCapacity] = useState(null);
    const [price, setPrice] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [productPriceId, setProductPriceId] = useState(null);
    const [loading, setLoading] = useState(true);
    

    // FUNCTIONS
    const formatText = (text) => {
        if (!text) return "";
        return text.replace(/\\r\\n|\\n|\\r/g, "<br />");
    };

    const fetchColors = async (productId) => {
        try {
            const response = await axiosClient.get(`/product/image/colors?productId=${productId}`);
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

    const fetchImages = async (productId, color) => {
        try {
            const response = await axiosClient.get(`/product/image/allImage?product_id=${productId}&color=${color}`);
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
            const response = await axiosClient.get(`/product/capacity?productId=${productId}`);
            const data = response.data || [];
            setCapacities(data);

            if (data.length > 0) {
                setSelectedCapacity(data[0]);
                fetchPrice(productId, currentColor, data[0]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách dung lượng:', error);
        }
    };

    const fetchPrice = async (productId, color, capacity) => {
        try {
            const response = await axiosClient.get(`/product/price?productId=${productId}&color=${color}&capacity=${capacity}`);
            if (response.data) {
                setPrice(response.data.price);
                setProductPriceId(response.data.productPriceId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy giá sản phẩm:', error);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await axiosClient.get(`/product/detail?productId=${productId}`);
            setProductDetails(response.data || {});
        } catch (error) {
            console.error('Lỗi khi lấy thông số chi tiết sản phẩm:', error);
            setProductDetails({});
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (color) => {
        setCurrentColor(color);
        fetchImages(product.id, color);
        fetchCapacities(product.id, color);
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
            const response = await axiosClient.get(`/product/price?productId=${product.id}&color=${currentColor}&capacity=${selectedCapacity}`);
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

            const addCartResponse = await axiosClient.post("/cart/create", cartRequest);

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

    // USE EFFECT
    useEffect(() => {
        if (product) {
            if (availableColors.length === 0) {
                fetchColors(product.id);
            }
            fetchCapacities(product.id);
            fetchProductDetails(product.id);
        }
    }, [product]);

    const formatValue = (value) => {
        if (value === null || value === undefined || value === "" || value === 0) {
            return "Chưa rõ";
        }
        return value;
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
                                {icon: faTruck, text: 'Miễn phí vận chuyển toàn quốc'},
                                {icon: faShieldAlt, text: 'Bảo hành 12 tháng chính hãng'},
                                {icon: faSyncAlt, text: 'Bao xài đổi lỗi 30 ngày đầu'},
                                {icon: faReceipt, text: 'Giá đã bao gồm VAT'},
                            ].map((item, index) => (
                                <div key={index} className="feature-item">
                                    <FontAwesomeIcon icon={item.icon}/>
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

                            {!loading && productDetails && Object.keys(productDetails).length > 0 ? (
                                <>
                                    <p><strong>Mô tả:</strong> {productDetails.description || 'Không có'}</p>
                                    <p><strong>Màn hình:</strong> {productDetails.screen} - {productDetails.screenSize}"
                                        - {productDetails.resolution} - {productDetails.frequency}</p>
                                    <p><strong>Độ sáng màn hình:</strong> {productDetails.screenBrightness}</p>
                                    <p><strong>Camera sau:</strong> {productDetails.rearCameraResolution}</p>
                                    <p><strong>Tính năng camera sau:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.rearCameraFeature)}}/>

                                    <p><strong>Camera trước:</strong> {productDetails.frontCameraResolution}</p>
                                    <p><strong>Tính năng camera trước:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.frontCameraFeature)}}/>

                                    <p><strong>Vi xử lý:</strong> {productDetails.microprocessor}</p>
                                    <p><strong>Tốc độ CPU:</strong> {productDetails.cpuSpeed}</p>
                                    <p><strong>GPU:</strong> {productDetails.graphicsProcessor}</p>
                                    <p><strong>RAM:</strong> {productDetails.ram}</p>
                                    <p><strong>Hệ điều hành:</strong> {productDetails.operatingSystem}</p>
                                    <p><strong>Bộ nhớ ngoài:</strong> {productDetails.externalMemoryCard}</p>
                                    <p><strong>NFC:</strong> {productDetails.nfc}</p>
                                    <p><strong>Kết nối mạng:</strong> {productDetails.network}</p>
                                    <p><strong>Khe SIM:</strong> {productDetails.simSlot}</p>
                                    <p><strong>WiFi:</strong> {productDetails.wifi}</p>
                                    <p><strong>Định vị:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.positioning)}}/>

                                    <p><strong>Bluetooth:</strong> {productDetails.bluetooth}</p>
                                    <p><strong>Jack tai nghe:</strong> {productDetails.jackEarphone}</p>
                                    <p><strong>Cổng sạc:</strong> {productDetails.charger}</p>
                                    <p><strong>Cảm biến:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.sensor)}}/>

                                    <p><strong>Kích thước:</strong> {productDetails.size}</p>
                                    <p><strong>Trọng lượng:</strong> {productDetails.weight}</p>
                                    <p><strong>Chất liệu:</strong> {productDetails.material}</p>
                                    <p><strong>Thiết kế:</strong> {productDetails.design}</p>
                                    <p><strong>Pin:</strong> {productDetails.batteryCapacity}mAh ({productDetails.batteryType})</p>
                                    <p><strong>Công nghệ pin:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.batteryTechnology)}}/>
                                    <p><strong>Sạc tối đa:</strong> {productDetails.maximumCharge}</p>

                                    <p><strong>Tính năng đặc biệt:</strong></p>
                                    <div dangerouslySetInnerHTML={{__html: formatText(productDetails.specialFeatures)}}/>

                                    <p><strong>Bảo mật:</strong> {productDetails.security}</p>
                                    <p><strong>Chống nước / bụi:</strong> {productDetails.resistant}</p>
                                </>
                            ) : loading ? (
                                <p>Đang tải thông tin sản phẩm...</p>
                            ) : (
                                <p>Không có thông tin chi tiết cho sản phẩm này.</p>
                            )}
                        </div>


                    </div>
                </div>

            </div>
            <Footer/>
        </div>
    );
};

export default Product;