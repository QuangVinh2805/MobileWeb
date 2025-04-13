import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Category_Detail.css';
import { useParams, useNavigate } from 'react-router-dom';

const Category_Detail = () => {
    const { categoryId } = useParams();
    const [categoryDetails, setCategoryDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!categoryId) return;

        axios.get(`http://localhost:8520/category/categoryDetail/${categoryId}`)
            .then(response => {
                setCategoryDetails(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu categoryDetail:', error);
            });
    }, [categoryId]);

    const handleClickCategoryDetail = (categoryDetail) => {
        // Chuyển trang kèm theo categoryDetailId
        navigate(`/product_category/${categoryDetail.id}`, {
            state: {
                categoryDetailName: categoryDetail.categoryDetailName
            }
        });
    };

    return (
        <div className='aside-category-detail'>
            <ul>
                {categoryDetails.map((detail, index) => (
                    <li
                        key={index}
                        className='icon'
                        onClick={() => handleClickCategoryDetail(detail)}
                    >
                        <span>{detail.categoryDetailName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Category_Detail;
