import React, { useState, useEffect } from "react";
import { FaTrash, FaUserEdit, FaPlus } from "react-icons/fa";
import { Button, Table, Modal, Form, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const roleMapping = {
    1: "Quản lý",
    2: "Khách hàng"
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "", password: "", name: "", address: "", email: "", phoneNumber: "", roleId: 2
    });

    useEffect(() => {
        fetch("http://localhost:8520/user/")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:8520/user/delete/${id}`, { method: "DELETE" })
            .then(() => setUsers(users.filter((user) => user.id !== id)))
            .catch((error) => console.error("Error deleting user:", error));
    };

    const handleShowEdit = (user) => {
        setEditUser(user);
        setShowEdit(true);
    };

    const handleCloseEdit = () => setShowEdit(false);
    const handleCloseAdd = () => setShowAdd(false);

    const handleUpdate = () => {
        fetch("http://localhost:8520/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editUser),
        })
            .then(() => {
                setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
                setShowEdit(false);
            })
            .catch((error) => console.error("Error updating user:", error));
    };

    const handleAddUser = () => {
        fetch("http://localhost:8520/user/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers([...users, data]);
                setShowAdd(false);
            })
            .catch((error) => console.error("Error adding user:", error));
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roleMapping[user.roleId]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4" style={{ backgroundColor: "white" }}>
            <h2 style={{ color: "black" }}>Quản lý tài khoản</h2>

            <div className="d-flex justify-content-between mb-3">
                <FormControl
                    type="text"
                    placeholder="Tìm kiếm theo tên, họ và tên, địa chỉ, vai trò..."
                    className="me-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="success" onClick={() => setShowAdd(true)}>
                    <FaPlus /> Thêm tài khoản
                </Button>
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên người dùng</th>
                    <th>Mật khẩu</th>
                    <th>Ngày sinh</th>
                    <th>Họ và tên</th>
                    <th>Địa chỉ</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{new Date(user.birthday).toLocaleDateString()}</td>
                        <td>{user.name}</td>
                        <td>{user.address}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{roleMapping[user.roleId] || "Không xác định"}</td>
                        <td>
                            <FaTrash className="text-danger mx-2" onClick={() => handleDelete(user.id)} style={{ cursor: "pointer" }} />
                            <FaUserEdit className="text-primary mx-2" onClick={() => handleShowEdit(user)} style={{ cursor: "pointer" }} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {editUser && (
                <Modal show={showEdit} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên người dùng</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUser.username}
                                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={editUser.password}
                                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày sinh</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editUser.birthday}
                                    onChange={(e) => setEditUser({ ...editUser, birthday: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUser.address}
                                    onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUser.phoneNumber}
                                    onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEdit}>Hủy</Button>
                        <Button variant="primary" onClick={handleUpdate}>Lưu</Button>
                    </Modal.Footer>
                </Modal>
            )}


            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên người dùng</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                value={newUser.birthday}
                                onChange={(e) => setNewUser({ ...newUser, birthday: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.address}
                                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.phoneNumber}
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vai trò</Form.Label>
                            <Form.Select
                                value={newUser.roleId}
                                onChange={(e) => setNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
                            >
                                <option value={1}>Quản lý</option>
                                <option value={2}>Khách hàng</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>Hủy</Button>
                    <Button variant="primary" onClick={handleAddUser}>Thêm</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default UserManagement;
