import React from "react";
import Sidebar from "./component/admin/Sidebar";
import "./AdminLayout.css"; // Import file CSS mới

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-content">{children}</div>
        </div>
    );
};

export default AdminLayout;
