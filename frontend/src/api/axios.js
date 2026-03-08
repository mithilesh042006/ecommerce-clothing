import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT access token
API.interceptors.request.use((config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
});

// Response interceptor — auto-refresh on 401
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            if (tokens?.refresh) {
                try {
                    const { data } = await axios.post('/api/auth/token/refresh/', {
                        refresh: tokens.refresh,
                    });
                    localStorage.setItem('tokens', JSON.stringify({
                        access: data.access,
                        refresh: data.refresh || tokens.refresh,
                    }));
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return API(originalRequest);
                } catch {
                    localStorage.removeItem('tokens');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;
