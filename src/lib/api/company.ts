import api from './axios';
import type {
	ApiResponse,
	PaginatedData,
	Company,
	Employee,
	CreditRequest,
	GeneratedPlan,
	CompanyOnboardingRequest
} from './types';

// ─── Companies ───────────────────────────────────────────────────────

export async function getCompanies(params?: { search?: string; page?: number; size?: number }) {
	const { data } = await api.get<ApiResponse<PaginatedData<Company>>>('/admin/companies', {
		params
	});
	return data;
}

export async function getCompany(id: number) {
	const { data } = await api.get<ApiResponse<Company>>(`/admin/companies/${id}`);
	return data;
}

export async function updateCompany(id: number, body: Partial<Company>) {
	const { data } = await api.put<ApiResponse<Company>>(`/admin/companies/${id}`, body);
	return data;
}

export async function freezeCompany(id: number) {
	const { data } = await api.post<ApiResponse<void>>(`/admin/companies/${id}/freeze`);
	return data;
}

export async function unfreezeCompany(id: number) {
	const { data } = await api.post<ApiResponse<void>>(`/admin/companies/${id}/unfreeze`);
	return data;
}

export async function deleteCompany(id: number) {
	const { data } = await api.delete<ApiResponse<void>>(`/admin/companies/${id}`);
	return data;
}

export async function getCompanyEmployees(companyId: number) {
	const { data } = await api.get<ApiResponse<Employee[]>>(
		`/admin/companies/${companyId}/employees`
	);
	return data;
}

// ─── Credit Requests ─────────────────────────────────────────────────

export async function getCreditRequests(params?: {
	status?: string;
	companyId?: number;
	page?: number;
	size?: number;
}) {
	const { data } = await api.get<ApiResponse<PaginatedData<CreditRequest>>>(
		'/credit-requests',
		{ params }
	);
	return data;
}

export async function getCreditRequest(id: number) {
	const { data } = await api.get<ApiResponse<CreditRequest>>(`/credit-requests/${id}`);
	return data;
}

export async function approveCreditRequest(id: number, note?: string) {
	const { data } = await api.post<ApiResponse<CreditRequest>>(
		`/credit-requests/${id}/approve`,
		{ note }
	);
	return data;
}

export async function rejectCreditRequest(id: number, reason: string) {
	const { data } = await api.post<ApiResponse<CreditRequest>>(
		`/credit-requests/${id}/reject`,
		{ reason }
	);
	return data;
}

// ─── Travel Plans ────────────────────────────────────────────────────

export async function getCompanyPlans(params?: { page?: number; size?: number }) {
	const { data } = await api.get<ApiResponse<PaginatedData<GeneratedPlan>>>(
		'/company-admin/plans',
		{ params }
	);
	return data;
}

// ─── Company Onboarding ──────────────────────────────────────────────

export async function getOnboardingRequests(params?: {
	status?: string;
	page?: number;
	size?: number;
}) {
	const { data } = await api.get<ApiResponse<PaginatedData<CompanyOnboardingRequest>>>(
		'/admin/company-onboarding',
		{ params }
	);
	return data;
}

export async function approveOnboarding(id: number) {
	const { data } = await api.post<ApiResponse<void>>(
		`/admin/company-onboarding/${id}/approve`
	);
	return data;
}

export async function rejectOnboarding(id: number, reason: string) {
	const { data } = await api.post<ApiResponse<void>>(
		`/admin/company-onboarding/${id}/reject`,
		{ reason }
	);
	return data;
}
