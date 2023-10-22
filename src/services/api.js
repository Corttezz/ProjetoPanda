import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projetopanda-webapp.azurewebsites.net', // ou outra URL base que você está usando
  // outros cabeçalhos e configurações globais, se houver
});

// Solicitar interceptor para incluir o token JWT no cabeçalho de autorização de cada solicitação
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
