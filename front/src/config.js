export const API_URL = import.meta.env.VITE_API_URL || 'https://api-rjrt.onrender.com';

export const getApiUrl = (endpoint) => {
    if (endpoint.startsWith('http://localhost:3000')) {
        return endpoint.replace('http://localhost:3000', API_URL);
    }
    return `${API_URL}${endpoint.replace(/^\/api/, '')}`;
};
