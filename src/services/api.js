import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projetopanda-webapp.azurewebsites.net', 

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
