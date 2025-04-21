// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8520',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
