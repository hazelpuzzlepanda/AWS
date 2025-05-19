import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.puzzlepanda.co',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000,
  withCredentials: true
});
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
    async (error) => {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(
              'https://api.puzzlepanda.co/api/user/refresh-token',
              {},
              { withCredentials: true }
            );
            const newAccessToken = res.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('Refresh Token expired or invalid. Logging out...');
            localStorage.removeItem('accessToken');
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
          }
        }
    return Promise.reject(error);
  }
);

export default axiosInstance;