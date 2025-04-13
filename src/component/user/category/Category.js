import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Category.css';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8520/category/allCategory')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu category:', error);
            });
    }, []);

    const handleCategoryClick = async (category) => {
        try {
            const response = await axios.get(`http://localhost:8520/product/byCategory/${category.id}`);
            const products = response.data;
            // Navigate đến trang Product.js và truyền state
            navigate(`/product/${category.id}`, {
                state: {
                    category,
                    products,
                }
            });
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo category:', error);
        }
    };

    return (
        <div className='aside'>
            <ul>
                {categories.map((category, index) => (
                    <li
                        key={index}
                        className='icon'
                        onClick={() => handleCategoryClick(category)}
                    >
                        <img src={category.icon} alt={category.categoryName} />
                        <span>{category.categoryName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category;
