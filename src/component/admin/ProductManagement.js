import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { Button, Table, Modal, Form, Image, Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
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
        fetch(`http://localhost:8520/product/delete/${id}`, { method: 'DELETE' })
            .then(() => {
                setProducts(products.filter((product) => product.id !== id));
            })
            .catch((error) => console.error("Error deleting product:", error));
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
        console.log("Tên sản phẩm:", newProduct.productName); // Thêm dòng này để kiểm tra giá trị
        // if (!newProduct.productName || !newProduct.productName.trim()) { // Kiểm tra xem productName có tồn tại và không phải là chuỗi trống
        //     alert("Tên sản phẩm không được để trống!");
        //     return; // Dừng lại nếu tên sản phẩm trống
        // }

        fetch("http://localhost:8520/product/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...newProduct, hidden: false }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Phản hồi mạng không ổn định");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Dữ liệu trả về từ API:", data); // Kiểm tra dữ liệu trả về
                setProducts([...products, data]);
                setShowModal(false);
                setNewProduct({
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
            })
            .catch((error) => console.error("Error updating product:", error));
    };

    const toggleDetails = (productId) => {
        if (expandedProduct?.productId === productId) {
            setExpandedProduct(null);
        } else {
            fetch(`http://localhost:8520/product/detail?productId=${productId}`)
                .then((res) => res.json())
                .then((data) => setExpandedProduct({ productId, details: data }))
                .catch((error) => console.error("Error fetching product details:", error));
        }
    };

    const filteredProducts = products.filter((product) => {
        const productName = product.productName || ""; // Nếu productName là null, gán giá trị rỗng
        const lowerCaseProductName = productName.toLowerCase(); // Chuyển đổi thành chữ thường

        const lowerCaseSearchName = searchName ? searchName.toLowerCase() : ""; // Kiểm tra searchName

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
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                            </td>
                            <td>
                                <FaEdit className="text-warning mx-2" onClick={() => {
                                    setNewProduct(product);
                                    setShowModal(true);
                                }} />
                                <FaTrash className="text-danger mx-2" onClick={() => handleDelete(product.id)} style={{ cursor: "pointer" }} />
                                <FaEyeSlash className="text-secondary mx-2" onClick={() => handleHide(product.id)} style={{ cursor: "pointer" }} />
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
                        {expandedProduct?.productId === product.id && (
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

            <Modal show={showModal} onHide={() => {
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
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{newProduct.id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control type="text" value={newProduct.productName} onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
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

                        {/* Thêm các trường nhập liệu khác cho các thuộc tính còn lại */}
                        <Form.Group className="mb-3">
                            <Form.Label>Vi xử lý</Form.Label>
                            <Form.Control type="text" value={newProduct.microprocessor} onChange={(e) => setNewProduct({ ...newProduct, microprocessor: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dung lượng pin</Form.Label>
                            <Form.Control type="text" value={newProduct.batteryCapacity} onChange={(e) => setNewProduct({ ...newProduct, batteryCapacity: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>RAM</Form.Label>
                            <Form.Control type="text" value={newProduct.ram} onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb- 3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Màn hình</Form.Label>
                            <Form.Control type="text" value={newProduct.screen} onChange={(e) => setNewProduct({ ...newProduct, screen: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tần số</Form.Label>
                            <Form.Control type="text" value={newProduct.frequency} onChange={(e) => setNewProduct({ ...newProduct, frequency: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Độ phân giải</Form.Label>
                            <Form.Control type="text" value={newProduct.resolution} onChange={(e) => setNewProduct({ ...newProduct, resolution: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kích thước màn hình</Form.Label>
                            <Form.Control type="number" value={newProduct.screenSize} onChange={(e) => setNewProduct({ ...newProduct, screenSize: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Độ sáng màn hình</Form.Label>
                            <Form.Control type="text" value={newProduct.screenBrightness} onChange={(e) => setNewProduct({ ...newProduct, screenBrightness: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Độ phân giải camera sau</Form.Label>
                            <Form.Control type="text" value={newProduct.rearCameraResolution} onChange={(e) => setNewProduct({ ...newProduct, rearCameraResolution: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phim camera sau</Form.Label>
                            <Form.Control type="text" value={newProduct.rearCameraFilm} onChange={(e) => setNewProduct({ ...newProduct, rearCameraFilm: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tính năng camera sau</Form.Label>
                            <Form.Control type="text" value={newProduct.rearCameraFeature} onChange={(e) => setNewProduct({ ...newProduct, rearCameraFeature: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Flash</Form.Label>
                            <Form.Control type="text" value={newProduct.flash} onChange={(e) => setNewProduct({ ...newProduct, flash: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Độ phân giải camera trước</Form.Label>
                            <Form.Control type="text" value={newProduct.frontCameraResolution} onChange={(e) => setNewProduct({ ...newProduct, frontCameraResolution: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phim camera trước</Form.Label>
                            <Form.Control type="text" value={newProduct.frontCameraFilm} onChange={(e) => setNewProduct({ ...newProduct, frontCameraFilm: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tính năng camera trước</Form.Label>
                            <Form.Control type="text" value={newProduct.frontCameraFeature} onChange={(e) => setNewProduct({ ...newProduct, frontCameraFeature: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tốc độ CPU</Form.Label>
                            <Form.Control type="text" value={newProduct.cpuSpeed} onChange={(e) => setNewProduct({ ...newProduct, cpuSpeed: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>GPU</Form.Label>
                            <Form.Control type="text" value={newProduct.graphicsProcessor} onChange={(e) => setNewProduct({ ...newProduct, graphicsProcessor: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hệ điều hành</Form.Label>
                            <Form.Control type="text" value={newProduct.operatingSystem} onChange={(e) => setNewProduct({ ...newProduct, operatingSystem: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thẻ nhớ ngoài</Form.Label>
                            <Form.Control type="text" value={newProduct.externalMemoryCard} onChange={(e) => setNewProduct({ ...newProduct, externalMemoryCard: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>NFC</Form.Label>
                            <Form.Control type="text" value={newProduct.nfc} onChange={(e) => setNewProduct({ ...newProduct, nfc: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mạng</Form.Label>
                            <Form.Control type="text" value={newProduct.network} onChange={(e) => setNewProduct({ ...newProduct, network: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slot SIM</Form.Label>
                            <Form.Control type="text" value={newProduct.simSlot} onChange={(e) => setNewProduct({ ...newProduct, simSlot: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>WiFi</Form.Label>
                            <Form.Control type="text" value={newProduct.wifi} onChange={(e) => setNewProduct({ ...newProduct, wifi: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Định vị</Form.Label>
                            <Form.Control type="text" value={newProduct.positioning} onChange={(e) => setNewProduct({ ...newProduct, positioning: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bluetooth</Form.Label>
                            <Form.Control type="text" value={newProduct.bluetooth} onChange={(e) => setNewProduct({ ...newProduct, bluetooth: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Jack tai nghe</Form.Label>
                            <Form.Control type="text" value={newProduct.jackEarphone} onChange={(e) => setNewProduct({ ...newProduct, jackEarphone: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sạc</Form.Label>
                            <Form.Control type="text" value={newProduct.charger} onChange={(e) => setNewProduct({ ...newProduct, charger: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cảm biến</Form.Label>
                            <Form.Control type="text" value={newProduct.sensor} onChange={(e) => setNewProduct({ ...newProduct, sensor: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kích thước</Form.Label>
                            <Form.Control type="text" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cân nặng</Form.Label>
                            <Form.Control type="text" value={newProduct.weight} onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chất liệu</Form.Label>
                            <Form.Control type="text" value={newProduct.material} onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thiết kế</Form.Label>
                            <Form.Control type="text" value={newProduct.design} onChange={(e) => setNewProduct({ ...newProduct, design: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chi tiết dung lượng pin</Form.Label>
                            <Form.Control type="number" value={newProduct.batteryCapacityDetail} onChange={(e) => setNewProduct({ ...newProduct, batteryCapacityDetail: e.target.value })} />
                        </Form.Group>
                        <Form.Group className=" mb-3">
                            <Form.Label>Công nghệ pin</Form.Label>
                            <Form.Control type="text" value={newProduct.batteryTechnology} onChange={(e) => setNewProduct({ ...newProduct, batteryTechnology: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Loại pin</Form.Label>
                            <Form.Control type="text" value={newProduct.batteryType} onChange={(e) => setNewProduct({ ...newProduct, batteryType: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sạc tối đa</Form.Label>
                            <Form.Control type="text" value={newProduct.maximumCharge} onChange={(e) => setNewProduct({ ...newProduct, maximumCharge: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tính năng đặc biệt</Form.Label>
                            <Form.Control type="text" value={newProduct.specialFeatures} onChange={(e) => setNewProduct({ ...newProduct, specialFeatures: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bảo mật</Form.Label>
                            <Form.Control type="text" value={newProduct.security} onChange={(e) => setNewProduct({ ...newProduct, security: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chống nước</Form.Label>
                            <Form.Control type="text" value={newProduct.resistant} onChange={(e) => setNewProduct({ ...newProduct, resistant: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian ra mắt</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newProduct.launchTime ? newProduct.launchTime.substring(0, 16) : ""} // Kiểm tra launchTime
                                onChange={(e) => setNewProduct({ ...newProduct, launchTime: e.target.value })}
                            />                        </Form.Group>
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