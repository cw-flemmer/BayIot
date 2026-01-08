import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Should be dynamic in production
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                // Redirect to login if refresh fails
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
