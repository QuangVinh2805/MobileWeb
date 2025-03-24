import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { Button, Table, Modal, Form, Image, Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", imageUrl: "" });
    const [searchName, setSearchName] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [expandedProduct, setExpandedProduct] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8520/product/all")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handleHide = (id) => {
        setProducts(
            products.map((product) =>
                product.id === id ? { ...product, hidden: !product.hidden } : product
            )
        );
    };

    const handleAddProduct = () => {
        setProducts([...products, { id: Date.now(), ...newProduct, hidden: false }]);
        setShowModal(false);
        setNewProduct({ name: "", price: "", imageUrl: "" });
    };

    const toggleDetails = (productId) => {
        if (expandedProduct?.productId === productId) {
            // Nếu sản phẩm đã được mở, bấm lại thì ẩn đi
            setExpandedProduct(null);
        } else {
            // Nếu sản phẩm chưa mở, gọi API để lấy thông tin chi tiết
            fetch(`http://localhost:8520/product/detail?productId=${productId}`)
                .then((res) => res.json())
                .then((data) => setExpandedProduct({ productId, details: data }))
                .catch((error) => console.error("Error fetching product details:", error));
        }
    };


    const filteredProducts = products.filter((product) => {
        return (
            product.productName.toLowerCase().includes(searchName.toLowerCase()) &&
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
                                <FaEdit className="text-warning mx-2" />
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

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL Hình ảnh</Form.Label>
                            <Form.Control type="text" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleAddProduct}>Thêm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;