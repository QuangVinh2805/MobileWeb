import React, { useState } from 'react';
import './Banner.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
    const settings = {
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className="banner">
            <Slider {...settings}>
                <div><img src="../../../assets/images/banner/banner1.jpg" alt="Banner 1" /></div>
                <div><img src="../../../assets/images/banner/banner2.jpg" alt="Banner 2" /></div>
                <div><img src="../../../assets/images/banner/banner3.jpg" alt="Banner 3" /></div>
                <div><img src="../../../assets/images/banner/banner4.jpg" alt="Banner 4" /></div>
            </Slider>
        </div>
    );
};
export default Banner;
