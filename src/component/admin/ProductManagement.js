import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEyeSlash, FaEye, FaChevronDown } from "react-icons/fa";
import { Button, Table, Modal, Form, Image, Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDatabase } from "react-icons/fa";
import axios from "axios";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productCapacities, setProductCapacities] = useState({});
    const [productColors, setProductColors] = useState({});
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedCapacity, setSelectedCapacity] = useState(null);
    const [productImages, setProductImages] = useState({});
    const [productPrices, setProductPrices] = useState({}); // State lưu trữ giá theo màu và dung lượng
    const [showCapacityModal, setShowCapacityModal] = useState(false);
    const [selectedProductIdForCapacity, setSelectedProductIdForCapacity] = useState(null);
    const [newCapacity, setNewCapacity] = useState({ capacity: '', price: '' });
    const [showAddColorModal, setShowAddColorModal] = useState(false);
    const [selectedProductIdForColor, setSelectedProductIdForColor] = useState(null);
    const [selectedCapacityForColor, setSelectedCapacityForColor] = useState(null);
    const [newColor, setNewColor] = useState({ color: '', price: '' });
    const [availableCapacities, setAvailableCapacities] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);




    const [newProduct, setNewProduct] = useState({
        id: null,
        productName: "",
        price: "",
        avatar: "",
        microprocessor: "",
        batteryCapacity: "",
        ram: "",
        description: "",
        screen: "",
        frequency: "",
        resolution: "",
        screenSize: 0,
        screenBrightness: "",
        rearCameraResolution: "",
        rearCameraFilm: "",
        rearCameraFeature: "",
        flash: "",
        frontCameraResolution: "",
        frontCameraFilm: "",
        frontCameraFeature: "",
        cpuSpeed: "",
        graphicsProcessor: "",
        operatingSystem: "",
        externalMemoryCard: "",
        nfc: "",
        network: "",
        simSlot: "",
        wifi: "",
        positioning: "",
        bluetooth: "",
        jackEarphone: "",
        charger: "",
        sensor: "",
        size: "",
        weight: "",
        material: "",
        design: "",
        batteryCapacityDetail: 0,
        batteryTechnology: "",
        batteryType: "",
        maximumCharge: "",
        specialFeatures: "",
        security: "",
        resistant: "",
        launchTime: new Date().toISOString(), // Đảm bảo rằng launchTime được khởi tạo
    });
    const [searchName, setSearchName] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [expandedProduct, setExpandedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch("http://localhost:8520/product/all")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Dữ liệu không phải là một mảng:", data);
                    setProducts([]); // Đặt thành mảng rỗng nếu không phải là mảng
                }
            })
            .catch((error) => console.error("Error fetching products:", error));
    };


    const handleDelete = (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
        if (!confirmed) return;

        fetch(`http://localhost:8520/product/delete/${id}`, { method: 'DELETE' })
            .then(() => {
                setProducts(products.filter((product) => product.id !== id));
            })
            .catch((error) => console.error("Error deleting product:", error));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8520/category/allCategory");
                if (!response.ok) {
                    throw new Error("Lỗi khi tải danh mục");
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };

        const fetchCategoryDetails = async () => {
            try {
                const response = await fetch("http://localhost:8520/category/allCategoryDetail");
                if (!response.ok) {
                    throw new Error("Lỗi khi tải chi tiết danh mục");
                }
                const data = await response.json();
                setCategoryDetails(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết danh mục:", error);
            }
        };

        if (showModal) {
            fetchCategories();
            fetchCategoryDetails();
        }
    }, [showModal]);

    useEffect(() => {
        setSelectedColor(null);
        setSelectedCapacity(null);
        setProductImages({}); // Reset hình ảnh khi sản phẩm mở rộng thay đổi
        setProductPrices({}); // Reset giá khi sản phẩm mở rộng thay đổi
    }, [expandedProduct?.productId]);

    const fetchProductImages = (productId, color) => {
        axios.get("http://localhost:8520/product/image/allImage", {
            params: {
                product_id: productId,
                color: color
            }
        })
            .then(res => {
                setProductImages(prev => ({
                    ...prev,
                    [productId]: res.data
                }));
                console.log(`Hình ảnh sản phẩm ${productId} theo màu ${color}:`, res.data);
            })
            .catch(err => {
                console.error(`Lỗi khi lấy hình ảnh sản phẩm ${productId} theo màu ${color}:`, err);
                setProductImages(prev => {
                    const newState = { ...prev };
                    delete newState[productId];
                    return newState;
                });
            });
    };

    const fetchProductPrice = (productId, color, capacity) => {
        axios.get("http://localhost:8520/product/price", {
            params: {
                productId: productId,
                color: color,
                capacity: capacity
            }
        })
            .then(res => {
                setProductPrices(prev => ({
                    ...prev,
                    [productId]: res.data
                }));
                console.log(`Giá sản phẩm ${productId} theo màu ${color} và dung lượng ${capacity}:`, res.data);
            })
            .catch(err => {
                console.error(`Lỗi khi lấy giá sản phẩm ${productId} theo màu ${color} và dung lượng ${capacity}:`, err);
                setProductPrices(prev => {
                    const newState = { ...prev };
                    delete newState[productId];
                    return newState;
                });
            });
    };


    const handleHide = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8520/product/hide/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                if (status === 0) {
                    toast.success('Hiển thị sản phẩm thành công!');
                } else {
                    toast.success('Ẩn sản phẩm thành công!');
                }
                fetchProducts(); // Gọi lại để cập nhật danh sách sản phẩm
            } else {
                const errorMessage = await response.text();
                toast.error(errorMessage || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        }
    };


    const handleAddProduct = () => {
        // Kiểm tra xem tên sản phẩm có trống hay không
        console.log("Tên sản phẩm:", newProduct.productName);

        const productData = {
            ...newProduct,
            hidden: false,
            categoryName: newProduct.category, // Gửi trực tiếp giá trị chuỗi
            categoryDetailName: newProduct.categoryDetail, // Gửi trực tiếp giá trị chuỗi
        };

        fetch("http://localhost:8520/product/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Phản hồi mạng không ổn định");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Dữ liệu trả về từ API:", data);
                setProducts([...products, data]);
                alert("🎉 Thêm sản phẩm thành công!");
                setShowModal(false);
                setNewProduct({
                    id: null,
                    productName: "",
                    price: "",
                    avatar: "",
                    category: "",
                    categoryDetail: "",
                    microprocessor: "",
                    batteryCapacity: "",
                    ram: "",
                    description: "",
                    screen: "",
                    frequency: "",
                    resolution: "",
                    screenSize: 0,
                    screenBrightness: "",
                    rearCameraResolution: "",
                    rearCameraFilm: "",
                    rearCameraFeature: "",
                    flash: "",
                    frontCameraResolution: "",
                    frontCameraFilm: "",
                    frontCameraFeature: "",
                    cpuSpeed: "",
                    graphicsProcessor: "",
                    operatingSystem: "",
                    externalMemoryCard: "",
                    nfc: "",
                    network: "",
                    simSlot: "",
                    wifi: "",
                    positioning: "",
                    bluetooth: "",
                    jackEarphone: "",
                    charger: "",
                    sensor: "",
                    size: "",
                    weight: "",
                    material: "",
                    design: "",
                    batteryCapacityDetail: 0,
                    batteryTechnology: "",
                    batteryType: "",
                    maximumCharge: "",
                    specialFeatures: "",
                    security: "",
                    resistant: "",
                    launchTime: new Date().toISOString(),
                });
            })
            .catch((error) => console.error("Lỗi khi thêm sản phẩm:", error));
    };
    const handleUpdateProduct = (product) => {
        fetch(`http://localhost:8520/product/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(products.map((p) => (p.id === data.id ? data : p)));
                setExpandedProduct(null);
                alert("🎉 Chỉnh sửa sản phẩm thành công!");

            })
            .catch((error) => console.error("Error updating product:", error));
    };

    const toggleDetails = (productId) => {
        if (expandedProduct?.productId === productId) {
            setExpandedProduct(null);
            setProductCapacities(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
            setProductColors(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
            setProductImages(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
            setProductPrices(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
            setSelectedColor(null);
            setSelectedCapacity(null);
        } else {
            setExpandedProduct({ productId, details: null });

            fetch(`http://localhost:8520/product/detail?productId=${productId}`)
                .then((res) => res.json())
                .then((data) => setExpandedProduct(prev => ({ ...prev, details: data })))
                .catch((error) => console.error("Error fetching product details:", error));

            axios.get("http://localhost:8520/product/capacity", {
                params: { productId }
            })
                .then(res => {
                    setProductCapacities(prev => ({
                        ...prev,
                        [productId]: res.data
                    }));
                })
                .catch(err => {
                    console.error("Lỗi khi lấy dung lượng:", err);
                });
            axios.get("http://localhost:8520/product/image/colors", {
                params: { productId }
            })
                .then(res => {
                    setProductColors(prev => ({
                        ...prev,
                        [productId]: res.data
                    }));
                })
                .catch(err => {
                    console.error("Lỗi khi lấy màu sắc:", err);
                });
        }
    };
    const fetchCapacities = async () => {
        if (!selectedProductIdForColor) return;
        try {
            const res = await axios.get("http://localhost:8520/product/capacity", {
                params: { productId: selectedProductIdForColor }
            });
            setAvailableCapacities(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách dung lượng:", err);
            toast.error("Không thể tải danh sách dung lượng.");
            setAvailableCapacities([]);
        }
    };
    useEffect(() => {
        if (selectedProductIdForColor) {
            axios.get("http://localhost:8520/product/capacity", {
                params: { productId: selectedProductIdForColor }
            })
                .then(res => {
                    setAvailableCapacities(res.data);
                })
                .catch(err => console.error("Lỗi lấy danh sách dung lượng:", err));
        }
    }, [selectedProductIdForColor]);


    const handleOpenAddCapacityModal = (productId) => {
        setSelectedProductIdForCapacity(productId);
        setShowCapacityModal(true);
        setNewCapacity({ capacity: '', price: '' }); // Reset form
    };

    const handleCloseCapacityModal = () => {
        setShowCapacityModal(false);
        setSelectedProductIdForCapacity(null);
    };

    const handleAddCapacity = () => {
        if (!selectedProductIdForCapacity) return;
        if (!newCapacity.capacity.trim()) {
            alert("Vui lòng nhập dung lượng.");
            return;
        }

        axios.post(`http://localhost:8520/product/capacity/create/noColor?productId=${selectedProductIdForCapacity}`, newCapacity)
            .then(res => {
                console.log("Thêm dung lượng thành công:", res.data);
                toast.success(`Đã thêm dung lượng '${newCapacity.capacity}' thành công!`);
                // Cập nhật lại danh sách dung lượng cho sản phẩm
                axios.get("http://localhost:8520/product/capacity", {
                    params: { productId: selectedProductIdForCapacity }
                })
                    .then(res => {
                        setProductCapacities(prev => ({
                            ...prev,
                            [selectedProductIdForCapacity]: res.data
                        }));
                    })
                    .catch(err => {
                        console.error("Lỗi khi lấy lại dung lượng sau khi thêm:", err);
                    });
                handleCloseCapacityModal();
            })
            .catch(err => {
                console.error("Lỗi khi thêm dung lượng:", err);
                toast.error(err.response?.data?.message || "Có lỗi khi thêm dung lượng.");
            });
    };

    const handleOpenAddColorModal = async (productId) => {
        setSelectedProductIdForColor(productId);
        setSelectedCapacityForColor('');
        setNewColor({ color: '', price: '' });
        setShowAddColorModal(true);

        try {
            const res = await axios.get("http://localhost:8520/product/capacity", {
                params: { productId }
            });
            setAvailableCapacities(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách dung lượng:", err);
            toast.error("Không thể tải danh sách dung lượng.");
            setAvailableCapacities([]);
        }
    };


    const handleCloseAddColorModal = () => {
        setShowAddColorModal(false);
        setSelectedProductIdForColor(null);
        setSelectedCapacityForColor(null);
        setNewColor({ color: '', price: '' });
    };

    const handleAddColor = () => {
        if (!selectedProductIdForColor || !selectedCapacityForColor) {
            alert("Vui lòng chọn dung lượng.");
            return;
        }
        if (!newColor.color.trim()) {
            alert("Vui lòng nhập màu sắc.");
            return;
        }

        axios.post(
            `http://localhost:8520/product/color/create?productId=${selectedProductIdForColor}&capacity=${selectedCapacityForColor}`,
            newColor
        )
            .then(res => {
                toast.success(`Đã thêm màu '${newColor.color}' cho dung lượng '${selectedCapacityForColor}'!`);
                // Cập nhật lại danh sách màu
                axios.get("http://localhost:8520/product/image/colors", {
                    params: { productId: selectedProductIdForColor }
                })
                    .then(res => {
                        setProductColors(prev => ({
                            ...prev,
                            [selectedProductIdForColor]: res.data
                        }));
                    });
                fetchProductPrice(
                    selectedProductIdForColor,
                    newColor.color.toLowerCase(),
                    selectedCapacityForColor
                );
                handleCloseAddColorModal();
            })
            .catch(err => {
                console.error("Lỗi khi thêm màu sắc:", err);
                toast.error(err.response?.data?.message || "Có lỗi khi thêm màu sắc.");
            });
    };


    const handleUploadImage = async () => {
        if (!file) {
            alert("Vui lòng chọn ảnh trước.");
            return;
        }

        if (!selectedProductIdForColor || !selectedColor) {
            alert("Vui lòng chọn sản phẩm và màu trước khi thêm ảnh.");
            return;
        }

        const imageUrl = URL.createObjectURL(file); // dùng tạm giống avatar

        const payload = {
            productId: selectedProductIdForColor,
            color: selectedColor,
            image: imageUrl,
        };

        try {
            const res = await fetch("http://localhost:8520/product/image/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Upload ảnh thất bại");

            const data = await res.json();
            alert("Upload ảnh thành công!");

            // Sau khi upload thành công, cập nhật danh sách ảnh
            fetchProductImages(selectedProductIdForColor, selectedColor);

            // Reset lại file & preview
            setFile(null);
            setPreviewImage(null);
        } catch (error) {
            console.error(error);
            alert(error.message || "Lỗi upload ảnh");
        }
    };

    const filteredProducts = products.filter((product) => {
        const productName = product.productName || "";
        const lowerCaseProductName = productName.toLowerCase();

        const lowerCaseSearchName = searchName ? searchName.toLowerCase() : "";

        return (
            lowerCaseProductName.includes(lowerCaseSearchName) &&
            (searchPrice === "" || product.price.toString().includes(searchPrice))
        );
    });

    return (
        <div className="container mt-4" style={{ backgroundColor: "white" }}>
            <h2 style={{ color: "black" }}>Quản lý sản phẩm</h2>

            <div className="d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="me-2"
                />
                <Form.Control
                    type="number"
                    placeholder="Tìm theo giá..."
                    value={searchPrice}
                    onChange={(e) => setSearchPrice(e.target.value)}
                    className="me-2"
                />
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product) => (
                    <React.Fragment key={product.id}>
                        <tr className={product.hidden ? "text-muted" : ""}>
                            <td>{product.id}</td>
                            <td>
                                <Image
                                    src={product.avatar || "https://via.placeholder.com/50"}
                                    alt="Hình ảnh sản phẩm"
                                    width={50}
                                    height={50}
                                    rounded
                                />
                            </td>
                            <td>{product.productName}</td>
                            <td>
                                {productPrices[product.id] ? (
                                    `${new Intl.NumberFormat("vi-VN").format(productPrices[product.id].price)} VNĐ`
                                ) : (
                                    `${new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ`
                                )}
                            </td>
                            <td>
                                <FaEdit className="text-warning mx-2" onClick={() => {
                                    setNewProduct(product);
                                    setShowModal(true);
                                }}/>

                                <FaTrash className="text-danger mx-2" onClick={() => handleDelete(product.id)}
                                         style={{cursor: "pointer"}}/>
                                {product.status === 1 ? (
                                    <FaEye
                                        className="text-secondary mx-2"
                                        onClick={() => handleHide(product.id, product.status)}
                                        style={{cursor: "pointer"}}
                                        title="Hiển thị sản phẩm"
                                    />
                                ) : (
                                    <FaEyeSlash
                                        className="text-secondary mx-2"
                                        onClick={() => handleHide(product.id, product.status)}
                                        style={{cursor: "pointer"}}
                                        title="Ẩn sản phẩm"

                                    />

                                )}
                                <FaChevronDown
                                    className="text-primary mx-2"
                                    onClick={() => toggleDetails(product.id)}
                                    style={{
                                        cursor: "pointer",
                                        transform: expandedProduct?.productId === product.id ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease"
                                    }}
                                />
                            </td>
                        </tr>
                        {expandedProduct?.productId === product.id && productCapacities[product.id] && (
                            <tr>
                                <td colSpan="5">
                                <strong>Dung lượng:</strong>{" "}
                                    {productCapacities[product.id].map((capacity, idx) => (
                                        <Button
                                            key={idx}
                                            variant={selectedCapacity === capacity ? "primary" : "outline-secondary"}
                                            className="me-2 mb-2"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedCapacity(capacity);
                                                if (selectedColor) {
                                                    fetchProductPrice(expandedProduct.productId, selectedColor, capacity);
                                                }
                                            }}
                                        >
                                            {capacity}
                                        </Button>
                                    ))}
                                    {expandedProduct?.productId === product.id && (
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleOpenAddCapacityModal(product.id)}
                                        >
                                            Thêm dung lượng
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )}
                        {expandedProduct?.productId === product.id && productColors[product.id] && (
                            <tr>
                                <td colSpan="5">
                                    <strong>Màu sắc:</strong>{" "}
                                    {productColors[product.id].map((colorObj, idx) => (
                                        <Button
                                            key={idx}
                                            variant={selectedColor === colorObj.color ? "primary" : "outline-info"}
                                            className="me-2 mb-2"
                                            size="sm"
                                            style={{ backgroundColor: colorObj.colorCode, color: 'black' }}
                                            onClick={() => {
                                                setSelectedColor(colorObj.color);
                                                fetchProductImages(expandedProduct.productId, colorObj.color);
                                                if (selectedCapacity) {
                                                    fetchProductPrice(expandedProduct.productId, colorObj.color, selectedCapacity);
                                                }
                                                setSelectedProductIdForColor(expandedProduct.productId); // Đảm bảo có dòng này

                                            }}
                                        >
                                            {colorObj.color}
                                        </Button>
                                    ))}

                                    {expandedProduct?.productId === product.id && (
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="ms-2 mb-2"
                                            onClick={() => handleOpenAddColorModal(product.id)}
                                        >
                                            Thêm màu
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )}
                        {expandedProduct?.productId === product.id && productImages[product.id]?.length > 0 && (
                            <tr>
                                <td colSpan="5">
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex flex-wrap">
                                        {productImages[product.id].map((image, idx) => (
                                            <Image
                                                key={idx}
                                                src={image.image || "https://via.placeholder.com/100"}
                                                alt={`Hình ảnh ${idx + 1}`}
                                                width={100}
                                                objectFit={"cover"}
                                                className="me-2 mb-2"
                                                rounded
                                            />
                                        ))}
                                        <Form.Group className="col-md-6 mb-3">
                                            <Form.Label>Thêm ảnh sản phẩm</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files[0];
                                                    if (selectedFile) {
                                                        setFile(selectedFile);
                                                        setPreviewImage(URL.createObjectURL(selectedFile));
                                                    }
                                                }}
                                            />
                                            {previewImage && (
                                                <div className="mt-2">
                                                    <img
                                                        src={previewImage}
                                                        alt="preview"
                                                        style={{ maxWidth: "100%", height: "auto" }}
                                                    />
                                                    <Button className="mt-2" onClick={handleUploadImage}>
                                                        Thêm ảnh
                                                    </Button>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {expandedProduct?.productId === product.id && expandedProduct.details && (
                            <tr>
                                <td colSpan="5">
                                    <Collapse in={expandedProduct?.productId === product.id}>
                                        <div>
                                            <strong>Mô tả:</strong> {expandedProduct.details.description} <br />
                                            <strong>Màn hình:</strong> {expandedProduct.details.screen} - {expandedProduct.details.resolution} ({expandedProduct.details.screenSize}" - {expandedProduct.details.screenBrightness}) <br />
                                            <strong>Camera chính:</strong> {expandedProduct.details.rearCameraResolution} ({expandedProduct.details.rearCameraFeature}) <br />
                                            <strong>Pin:</strong> {expandedProduct.details.batteryCapacity}mAh ({expandedProduct.details.batteryTechnology}) <br />
                                            <strong>Bộ xử lý:</strong> {expandedProduct.details.microprocessor} ({expandedProduct.details.cpuSpeed}) <br />
                                            <strong>Hệ điều hành:</strong> {expandedProduct.details.operatingSystem} <br />
                                        </div>
                                    </Collapse>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </Table>
            {/* Modal Thêm Dung lượng */}
            <Modal show={showCapacityModal} onHide={handleCloseCapacityModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Dung lượng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Dung lượng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập dung lượng (ví dụ: 64GB)"
                                value={newCapacity.capacity}
                                onChange={(e) => setNewCapacity({ ...newCapacity, capacity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá cho dung lượng này"
                                value={newCapacity.price}
                                onChange={(e) => setNewCapacity({ ...newCapacity, price: e.target.value ? parseInt(e.target.value) : '' })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCapacityModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddCapacity}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddColorModal} onHide={handleCloseAddColorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Màu Sắc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Dung Lượng</Form.Label>
                            <Form.Select
                                value={selectedCapacityForColor || ''}
                                onChange={(e) => setSelectedCapacityForColor(e.target.value)}
                            >
                                <option value="">-- Chọn dung lượng --</option>
                                {availableCapacities.map((cap, idx) => (
                                    <option key={idx} value={cap}>
                                        {cap}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Màu sắc</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên màu (ví dụ: Đỏ)"
                                value={newColor.color}
                                onChange={(e) => setNewColor({ ...newColor, color: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá cho màu này"
                                value={newColor.price}
                                onChange={(e) =>
                                    setNewColor({ ...newColor, price: e.target.value ? parseInt(e.target.value) : '' })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddColorModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddColor}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setNewProduct({
                    id: null,
                    name: "",
                    price: "",
                    imageUrl: "",
                    category:"",
                    categoryDetail:"",
                    microprocessor: "",
                    batteryCapacity: "",
                    ram: "",
                    description: "",
                    screen: "",
                    frequency: "",
                    resolution: "",
                    screenSize: 0,
                    screenBrightness: "",
                    rearCameraResolution: "",
                    rearCameraFilm: "",
                    rearCameraFeature: "",
                    flash: "",
                    frontCameraResolution: "",
                    frontCameraFilm: "",
                    frontCameraFeature: "",
                    cpuSpeed: "",
                    graphicsProcessor: "",
                    operatingSystem: "",
                    externalMemoryCard: "",
                    nfc: "",
                    network: "",
                    simSlot: "",
                    wifi: "",
                    positioning: "",
                    bluetooth: "",
                    jackEarphone: "",
                    charger: "",
                    sensor: "",
                    size: "",
                    weight: "",
                    material: "",
                    design: "",
                    batteryCapacityDetail: 0,
                    batteryTechnology: "",
                    batteryType: "",
                    maximumCharge: "",
                    specialFeatures: "",
                    security: "",
                    resistant: "",
                    launchTime: new Date().toISOString(),
                });
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{newProduct.id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tên sản phẩm</Form.Label>
                                <Form.Control type="text" value={newProduct.productName} onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Giá</Form.Label>
                                <Form.Control type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.categoryName}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Chi tiết danh mục</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newProduct.categoryDetail}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryDetail: e.target.value })}
                                >
                                    <option value="">Chọn chi tiết danh mục</option>
                                    {categoryDetails.map((detail) => (
                                        <option key={detail.id} value={detail.categoryDetailName}>
                                            {detail.categoryDetailName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Hình ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setNewProduct({ ...newProduct, avatar: URL.createObjectURL(file) });
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Vi xử lý</Form.Label>
                                <Form.Control type="text" value={newProduct.microprocessor} onChange={(e) => setNewProduct({ ...newProduct, microprocessor: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Dung lượng pin</Form.Label>
                                <Form.Control type="text" value={newProduct.batteryCapacity} onChange={(e) => setNewProduct({ ...newProduct, batteryCapacity: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>RAM</Form.Label>
                                <Form.Control type="text" value={newProduct.ram} onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-12 mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control as="textarea" rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Màn hình</Form.Label>
                                <Form.Control type="text" value={newProduct.screen} onChange={(e) => setNewProduct({ ...newProduct, screen: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tần số</Form.Label>
                                <Form.Control type="text" value={newProduct.frequency} onChange={(e) => setNewProduct({ ...newProduct, frequency: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Độ phân giải</Form.Label>
                                <Form.Control type="text" value={newProduct.resolution} onChange={(e) => setNewProduct({ ...newProduct, resolution: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Kích thước màn hình</Form.Label>
                                <Form.Control type="text" value={newProduct.screenSize} onChange={(e) => setNewProduct({ ...newProduct, screenSize: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Độ sáng màn hình</Form.Label>
                                <Form.Control type="text" value={newProduct.screenBrightness} onChange={(e) => setNewProduct({ ...newProduct, screenBrightness: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Độ phân giải camera sau</Form.Label>
                                <Form.Control type="text" value={newProduct.rearCameraResolution} onChange={(e) => setNewProduct({ ...newProduct, rearCameraResolution: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Phim camera sau</Form.Label>
                                <Form.Control type="text" value={newProduct.rearCameraFilm} onChange={(e) => setNewProduct({ ...newProduct, rearCameraFilm: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tính năng camera sau</Form.Label>
                                <Form.Control type="text" value={newProduct.rearCameraFeature} onChange={(e) => setNewProduct({ ...newProduct, rearCameraFeature: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Flash</Form.Label>
                                <Form.Control type="text" value={newProduct.flash} onChange={(e) => setNewProduct({ ...newProduct, flash: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Độ phân giải camera trước</Form.Label>
                                <Form.Control type="text" value={newProduct.frontCameraResolution} onChange={(e) => setNewProduct({ ...newProduct, frontCameraResolution: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Phim camera trước</Form.Label>
                                <Form.Control type="text" value={newProduct.frontCameraFilm} onChange={(e) => setNewProduct({ ...newProduct, frontCameraFilm: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tính năng camera trước</Form.Label>
                                <Form.Control type="text" value={newProduct.frontCameraFeature} onChange={(e) => setNewProduct({ ...newProduct, frontCameraFeature: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tốc độ CPU</Form.Label>
                                <Form.Control type="text" value={newProduct.cpuSpeed} onChange={(e) => setNewProduct({ ...newProduct, cpuSpeed: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>GPU</Form.Label>
                                <Form.Control type="text" value={newProduct.graphicsProcessor} onChange={(e) => setNewProduct({ ...newProduct, graphicsProcessor: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Hệ điều hành</Form.Label>
                                <Form.Control type="text" value={newProduct.operatingSystem} onChange={(e) => setNewProduct({ ...newProduct, operatingSystem: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Thẻ nhớ ngoài</Form.Label>
                                <Form.Control type="text" value={newProduct.externalMemoryCard} onChange={(e) => setNewProduct({ ...newProduct, externalMemoryCard: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>NFC</Form.Label>
                                <Form.Control type="text" value={newProduct.nfc} onChange={(e) => setNewProduct({ ...newProduct, nfc: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Mạng</Form.Label>
                                <Form.Control type="text" value={newProduct.network} onChange={(e) => setNewProduct({ ...newProduct, network: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Slot SIM</Form.Label>
                                <Form.Control type="text" value={newProduct.simSlot} onChange={(e) => setNewProduct({ ...newProduct, simSlot: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>WiFi</Form.Label>
                                <Form.Control type="text" value={newProduct.wifi} onChange={(e) => setNewProduct({ ...newProduct, wifi: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Định vị</Form.Label>
                                <Form.Control type="text" value={newProduct.positioning} onChange={(e) => setNewProduct({ ...newProduct, positioning: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Bluetooth</Form.Label>
                                <Form.Control type="text" value={newProduct.bluetooth} onChange={(e) => setNewProduct({ ...newProduct, bluetooth: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Jack tai nghe</Form.Label>
                                <Form.Control type="text" value={newProduct.jackEarphone} onChange={(e) => setNewProduct({ ...newProduct, jackEarphone: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Sạc</Form.Label>
                                <Form.Control type="text" value={newProduct.charger} onChange={(e) => setNewProduct({ ...newProduct, charger: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Cảm biến</Form.Label>
                                <Form.Control type="text" value={newProduct.sensor} onChange={(e) => setNewProduct({ ...newProduct, sensor: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Kích thước</Form.Label>
                                <Form.Control type="text" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Cân nặng</Form.Label>
                                <Form.Control type="text" value={newProduct.weight} onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Chất liệu</Form.Label>
                                <Form.Control type="text" value={newProduct.material} onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Thiết kế</Form.Label>
                                <Form.Control type="text" value={newProduct.design} onChange={(e) => setNewProduct({ ...newProduct, design: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Chi tiết dung lượng pin</Form.Label>
                                <Form.Control type="number" value={newProduct.batteryCapacityDetail} onChange={(e) => setNewProduct({ ...newProduct, batteryCapacityDetail: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Công nghệ pin</Form.Label>
                                <Form.Control type="text" value={newProduct.batteryTechnology} onChange={(e) => setNewProduct({ ...newProduct, batteryTechnology: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Loại pin</Form.Label>
                                <Form.Control type="text" value={newProduct.batteryType} onChange={(e) => setNewProduct({ ...newProduct, batteryType: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Sạc tối đa</Form.Label>
                                <Form.Control type="text" value={newProduct.maximumCharge} onChange={(e) => setNewProduct({ ...newProduct, maximumCharge: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tính năng đặc biệt</Form.Label>
                                <Form.Control type="text" value={newProduct.specialFeatures} onChange={(e) => setNewProduct({ ...newProduct, specialFeatures: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Bảo mật</Form.Label>
                                <Form.Control type="text" value={newProduct.security} onChange={(e) => setNewProduct({ ...newProduct, security: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Chống nước</Form.Label>
                                <Form.Control type="text" value={newProduct.resistant} onChange={(e) => setNewProduct({ ...newProduct, resistant: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Thời gian ra mắt</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newProduct.launchTime ? newProduct.launchTime.substring(0, 16) : ""}
                                    onChange={(e) => setNewProduct({ ...newProduct, launchTime: e.target.value })}
                                />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false);
                        setNewProduct({
                            id: null,
                            name: "",
                            price: "",
                            imageUrl: "",
                            microprocessor: "",
                            batteryCapacity: "",
                            ram: "",
                            description: "",
                            screen: "",
                            frequency: "",
                            resolution: "",
                            screenSize: 0,
                            screenBrightness: "",
                            rearCameraResolution: "",
                            rearCameraFilm: "",
                            rearCameraFeature: "",
                            flash: "",
                            frontCameraResolution: "",
                            frontCameraFilm: "",
                            frontCameraFeature: "",
                            cpuSpeed: "",
                            graphicsProcessor: "",
                            operatingSystem: "",
                            externalMemoryCard: "",
                            nfc: "",
                            network: "",
                            simSlot: "",
                            wifi: "",
                            positioning: "",
                            bluetooth: "",
                            jackEarphone: "",
                            charger: "",
                            sensor: "",
                            size: "",
                            weight: "",
                            material: "",
                            design: "",
                            batteryCapacityDetail: 0,
                            batteryTechnology: "",
                            batteryType: "",
                            maximumCharge: "",
                            specialFeatures: "",
                            security: "",
                            resistant: "",
                            launchTime: new Date().toISOString(),
                        });
                    }}>Đóng</Button>
                    <Button variant="primary" onClick={() => {
                        if (newProduct.id) {
                            handleUpdateProduct(newProduct);
                        } else {
                            handleAddProduct();
                        }
                    }}>
                        {newProduct.id ? "Cập nhật" : "Thêm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;
