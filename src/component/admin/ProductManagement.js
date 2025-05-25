import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEyeSlash, FaEye, FaChevronDown } from "react-icons/fa";
import { Button, Table, Modal, Form, Image, Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const [selectedProductIdForColor, setSelectedProductIdForColor] = useState(null);
    const [availableCapacities, setAvailableCapacities] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [showAddCapacityModal, setShowAddCapacityModal] = useState(false);
    const [newCapacityInfo, setNewCapacityInfo] = useState({
        capacity: '',
        color: '',
        price: ''
    });
    const [availableColors, setAvailableColors] = useState([]);   // lấy từ /product/color
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [showEditCapacityModal, setShowEditCapacityModal] = useState(false);
    const [editCapacityInfo, setEditCapacityInfo] = useState({ capacity: '', color: '', price: '' });
    const [originalColor, setOriginalColor] = useState(''); // để giữ lại màu cũ khi cập nhật






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


    const openAddCapacityModal = async (productId) => {
        setSelectedProductId(productId);
        setNewCapacityInfo({ capacity: '', color: '', price: '' });
        setShowAddCapacityModal(true);

        try {
            const res = await axios.get('http://localhost:8520/product/color');
            setAvailableColors(res.data);                // [{id, color}, ...]
        } catch (e) {
            toast.error('Không thể tải danh sách màu.');
            setAvailableColors([]);
        }
    };

    const closeAddCapacityModal = () => {
        setShowAddCapacityModal(false);
        setSelectedProductId(null);
    };

    const openUpdateCapacityModal = (productId, capacity, color, price) => {
        if (!color || color.trim() === '') {
            toast.error('Vui lòng chọn màu trước khi chỉnh sửa');
            return;
        }
        setSelectedProductId(productId);
        setEditCapacityInfo({ capacity, color, price });
        setOriginalColor(color);
        setShowEditCapacityModal(true);
    };

    const closeEditCapacityModal = () => {
        setShowEditCapacityModal(false);
        setSelectedProductId(null);
        setEditCapacityInfo({ capacity: '', color: '', price: '' });
    };



    const handleAddCapacityWithColor = () => {
        if (!selectedProductId) return;

        const { capacity, color, price } = newCapacityInfo;
        if (!capacity.trim() || !color) {
            alert('Vui lòng nhập đầy đủ dung lượng và chọn màu.');
            return;
        }

        axios.post(
            `http://localhost:8520/product/capacity/create`,
            { capacity: capacity.trim(), color, price: price ? Number(price) : 0 },
            { params: { productId: selectedProductId } }
        )
            .then(res => {
                toast.success('Đã thêm dung lượng / màu thành công!');
                // reload capacities & colors list tuỳ logic cũ
                reloadCapacitiesAndColors(selectedProductId);
                closeAddCapacityModal();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Có lỗi khi thêm.');
            });
    };

    const reloadCapacitiesAndColors = (productId) => {
        axios.get('http://localhost:8520/product/capacity', { params: { productId } })
            .then(res => setProductCapacities(p => ({ ...p, [productId]: res.data })));

        axios.get('http://localhost:8520/product/image/colors', { params: { productId } })
            .then(res => setProductColors(p => ({ ...p, [productId]: res.data })));
    };

    const handleUpdateCapacity = () => {
        const { capacity, color, price } = editCapacityInfo;

        if (!selectedProductId || !capacity.trim() || !color.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (!originalColor || originalColor.trim() === '') {
            toast.error('Màu cũ không được để trống');
            return;
        }

        console.log('Sending updateCapacity payload:', {
            oldColor: originalColor.trim(),
            oldCapacity: capacity.trim(),
            newColor: color.trim(),
            newCapacity: capacity.trim(),
            price: price ? Number(price) : 0,
        });

        axios.put('http://localhost:8520/product/capacity/update', {
            oldColor: originalColor.trim(),
            oldCapacity: capacity.trim(),
            newColor: color.trim(),
            newCapacity: capacity.trim(),
            price: price ? Number(price) : 0
        }, {
            params: { productId: selectedProductId }
        })
            .then(() => {
                toast.success('Cập nhật thành công!');
                reloadCapacitiesAndColors(selectedProductId);
                closeEditCapacityModal();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Có lỗi khi cập nhật.');
            });
    };


    const handleDeleteCapacity = (productId, capacity) => {
        if (!window.confirm(`Xác nhận xoá tất cả màu với dung lượng "${capacity}"?`)) return;

        axios.delete(`http://localhost:8520/product/capacity/delete`, {
            params: { productId },
            data: { capacity }
        })
            .then(() => {
                toast.success('Đã xoá thành công!');
                reloadCapacitiesAndColors(productId);
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Có lỗi khi xoá.');
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

        const formData = new FormData();
        formData.append("productId", selectedProductIdForColor);
        formData.append("color", selectedColor);
        formData.append("file", file); // File thực

        try {
            const res = await fetch("http://localhost:8520/product/image/create", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload ảnh thất bại");

            const data = await res.json();
            alert("Upload ảnh thành công!");

            // Cập nhật danh sách ảnh
            fetchProductImages(selectedProductIdForColor, selectedColor);

            // Reset lại file & preview
            setFile(null);
            setPreviewImage(null);
        } catch (error) {
            console.error(error);
            alert(error.message || "Lỗi upload ảnh");
        }
    };

    const handleUpdateImage = async (imageId, newFile) => {
        if (!newFile) {
            alert("Vui lòng chọn ảnh mới trước khi cập nhật.");
            return;
        }

        const formData = new FormData();
        formData.append("file", newFile);

        try {
            const res = await axios.put(`http://localhost:8520/product/image/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    id: imageId,
                },
            });

            toast.success("Cập nhật ảnh thành công!");
            // Gọi lại fetch để cập nhật danh sách ảnh mới (ví dụ fetchProductImages)
            fetchProductImages(selectedProductIdForColor, selectedColor);
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật ảnh thất bại.");
        }
    };


    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Bạn có chắc muốn xóa ảnh này không?")) return;

        try {
            await axios.delete(`http://localhost:8520/product/image/delete`, {
                params: { id: imageId },
            });

            toast.success("Xóa ảnh thành công!");
            // Cập nhật lại danh sách ảnh sau khi xóa
            fetchProductImages(selectedProductIdForColor, selectedColor);
        } catch (error) {
            toast.error(error.response?.data?.message || "Xóa ảnh thất bại.");
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
                                        <div key={idx} className="d-inline-block me-2 mb-2">
                                            <Button
                                                variant={selectedCapacity === capacity ? "primary" : "outline-secondary"}
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

                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="ms-1"
                                                onClick={() => {
                                                    if (!selectedColor || selectedColor.trim() === '') {
                                                        toast.error('Vui lòng chọn màu trước khi chỉnh sửa');
                                                        return;
                                                    }
                                                    openUpdateCapacityModal(product.id, capacity, selectedColor, 0);
                                                }}
                                            >
                                                ✏
                                            </Button>


                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="ms-1"
                                                onClick={() => handleDeleteCapacity(product.id, capacity)}
                                            >
                                                🗑
                                            </Button>

                                        </div>
                                    ))}

                                    {expandedProduct?.productId === product.id && (
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => openAddCapacityModal(product.id)}
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
                                </td>
                            </tr>
                        )}
                        {expandedProduct?.productId === product.id && (
                            <tr>
                                <td colSpan="5">
                                    <strong>Hình ảnh:</strong>
                                    <div className="d-flex flex-wrap">
                                        {/* Hiển thị hình ảnh nếu có */}
                                        {productImages[product.id]?.length > 0 &&
                                            productImages[product.id].map((image, idx) => (
                                                <div key={idx} className="position-relative me-2 mb-2">
                                                    <Image
                                                        src={`http://localhost:8520${image.image}`}
                                                        alt={`Hình ảnh ${idx + 1}`}
                                                        width={100}
                                                        objectFit={"cover"}
                                                        rounded
                                                    />
                                                    <input
                                                        type="file"
                                                        style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, opacity: 0, cursor: "pointer" }}
                                                        onChange={(e) => {
                                                            const newFile = e.target.files[0];
                                                            if (newFile) {
                                                                handleUpdateImage(image.id, newFile);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        style={{ position: "absolute", top: 0, right: 0 }}
                                                        onClick={() => handleDeleteImage(image.id)}
                                                    >
                                                        🗑
                                                    </Button>
                                                </div>
                                            ))}




                                        {/* Form thêm ảnh luôn hiển thị */}
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
            {/* Modal Thêm Dung lượng + Màu */}
            <Modal show={showAddCapacityModal} onHide={closeAddCapacityModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Dung lượng & Màu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Dung lượng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ví dụ: 128GB"
                                value={newCapacityInfo.capacity}
                                onChange={e => setNewCapacityInfo({ ...newCapacityInfo, capacity: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Chọn Màu</Form.Label>
                            <Form.Select
                                value={newCapacityInfo.color}
                                onChange={e => setNewCapacityInfo({ ...newCapacityInfo, color: e.target.value })}
                            >
                                <option value="">-- Chọn màu --</option>
                                {availableColors.map(c => (
                                    <option key={c.id} value={c.color}>{c.color}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá"
                                value={newCapacityInfo.price}
                                onChange={e =>
                                    setNewCapacityInfo({ ...newCapacityInfo, price: e.target.value ? parseInt(e.target.value) : '' })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeAddCapacityModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddCapacityWithColor}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditCapacityModal} onHide={closeEditCapacityModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật dung lượng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Dung lượng</Form.Label>
                            <Form.Control
                                type="text"
                                value={editCapacityInfo.capacity}
                                onChange={(e) => setEditCapacityInfo({ ...editCapacityInfo, capacity: e.target.value })}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Màu</Form.Label>
                            <Form.Control
                                type="text"
                                value={editCapacityInfo.color}
                                onChange={(e) => setEditCapacityInfo({ ...editCapacityInfo, color: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                value={editCapacityInfo.price}
                                onChange={(e) => setEditCapacityInfo({ ...editCapacityInfo, price: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditCapacityModal}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCapacity}>
                        Cập nhật
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
