import axiox from 'axios';
import { ACCESS_TOKEN } from './constants';
import axios from 'axios';

const apiUrl = 'https://capstone-final-backend-7dup.onrender.com'

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);