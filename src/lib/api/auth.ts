import api from './axios';
import type { ApiResponse, LoginResponse, AdminUser } from './types';

export async function login(email: string, password: string) {
	const { data } = await api.post<ApiResponse<LoginResponse>>('/admin/auth/login', {
		email,
		password
	});
	return data;
}

export async function getMe() {
	const { data } = await api.get<ApiResponse<AdminUser>>('/admin/auth/me');
	return data;
}

export async function logout() {
	await api.post('/admin/auth/logout');
}
