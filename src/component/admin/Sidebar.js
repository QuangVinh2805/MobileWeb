import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa toàn bộ thông tin người dùng
        localStorage.clear(); // Xóa hết dữ liệu trong localStorage
        sessionStorage.clear(); // Nếu có lưu sessionStorage thì cũng xóa luôn

        // Chuyển hướng về màn hình đăng nhập
        navigate("/login");
    };

    return (
        <div className="sidebar bg-dark text-white p-3">
            <h4 className="logo">VPhone</h4>
            <ul className="list-unstyled">
                <li className="mb-3">
                    <Link to="/admin/manageProduct" className="text-white text-decoration-none">
                        <FaBox className="me-2" /> Quản lý sản phẩm
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/manageUser" className="text-white text-decoration-none">
                        <FaUsers className="me-2" /> Quản lý người dùng
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/manage-orders" className="text-white text-decoration-none">
                        <FaShoppingCart className="me-2" /> Quản lý đơn hàng
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/statistical" className="text-white text-decoration-none">
                        <FaChartBar className="me-2" /> Thống kê
                    </Link>
                </li>
                <li className="mb-3">
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                    >
                        <FaSignOutAlt className="me-2" /> Đăng xuất
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
