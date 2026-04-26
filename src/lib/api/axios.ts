import axios from 'axios';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
	headers: {
		'Content-Type': 'application/json',
		'X-Api-Key': import.meta.env.VITE_API_KEY || ''
	}
});

function getToken(): string | null {
	if (!browser) return null;
	const match = document.cookie.match(/(?:^|;\s*)support_access_token=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

export function setTokenCookie(token: string, expMs: number) {
	const expires = new Date(expMs).toUTCString();
	document.cookie = `support_access_token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function clearTokenCookie() {
	document.cookie = 'support_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (browser && (error.response?.status === 401 || error.response?.status === 403)) {
			clearTokenCookie();
			localStorage.removeItem('tmag-support-auth');
			goto('/login');
		}
		return Promise.reject(error);
	}
);

export default api;
