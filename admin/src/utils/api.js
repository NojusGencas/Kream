export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function buildApiUrl(path = "") {
  if (!path) return API_URL;
  if (/^https?:\/\//i.test(path)) {
      if (path.startsWith('http://localhost:3000')) {
          return path.replace('http://localhost:3000', API_URL);
      }
      return path;
  }
  return `${API_URL}${path.replace(/^\/api/, '')}`;
}

export function apiFetch(path, options) {
  return fetch(buildApiUrl(path), options);
}
