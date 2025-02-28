import React, { useState } from 'react';
import './Category.css';

const Category = () => {
    const categorys = [
        {
            name: 'Điện thoại',
            icon: '/assets/images/icon/phone.png',
        },
        {
            name: 'Laptop',
            icon: '/assets/images/icon/laptop.png',
        },
        {
            name: 'Tablet',
            icon: '/assets/images/icon/tablet.png',
        },
        {
            name: 'Desktop',
            icon: '/assets/images/icon/desktop-monitor.png',
        },
        {
            name: 'Phụ kiện',
            icon: '/assets/images/icon/cogs.png',
        },
        {
            name: 'Âm thanh',
            icon: '/assets/images/icon/medium-volume.png',
        },
        {
            name: 'Sửa chữa',
            icon: '/assets/images/icon/tools.png',
        },
    ]

    return (
        <div className='aside'>
            <ul>
                {categorys.map((category, index) => (
                    <li key={index} className='icon'>
                        <img src={category.icon} alt={category.name} />
                        <span>{category.name}</span>
                    </li>
                ))}
            </ul>
        </div>

    );

};

export default Category;