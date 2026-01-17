import axios from 'axios';

const api = axios.create({
    baseURL: 'https://treino-api-eg0s.onrender.com/api',
});

export default api;
