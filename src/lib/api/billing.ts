import api from './axios';
import type {
	ApiResponse,
	PaginatedData,
	CreditEntry,
	Invoice,
	EbookOrder,
	ExchangeRate,
	SupportedCurrency
} from './types';

// ─── Credit Quotes & Pricing ─────────────────────────────────────────

export async function getCompanyPricing(companyId: number) {
	const { data } = await api.get<ApiResponse<any>>('/company-admin/credits/pricing', {
		params: { companyId }
	});
	return data;
}

export async function getCompanyQuote(companyId: number, credits: number) {
	const { data } = await api.post<ApiResponse<any>>('/company-admin/credits/quote', null, {
		params: { companyId, credits }
	});
	return data;
}

// ─── Credit Ledger ───────────────────────────────────────────────────

export async function getCreditLedger(params?: {
	userId?: number;
	companyId?: number;
	page?: number;
	size?: number;
}) {
	const { data } = await api.get<ApiResponse<PaginatedData<CreditEntry>>>('/admin/ledger', {
		params
	});
	return data;
}

export async function adjustCredits(body: {
	userId?: number;
	companyId?: number;
	amount: number;
	reason: string;
}) {
	const { data } = await api.post<ApiResponse<CreditEntry>>('/admin/ledger/adjust', body);
	return data;
}

export async function resetUserCredits(userId: number, amount: number) {
	const { data } = await api.post<ApiResponse<void>>(`/admin/users/${userId}/reset-credits`, {
		amount
	});
	return data;
}

// ─── Invoices ────────────────────────────────────────────────────────

export async function getInvoices(params?: {
	status?: string;
	page?: number;
	size?: number;
}) {
	const { data } = await api.get<ApiResponse<PaginatedData<Invoice>>>('/admin/billing/invoices', {
		params
	});
	return data;
}

export async function getInvoice(id: number) {
	const { data } = await api.get<ApiResponse<Invoice>>(`/admin/billing/invoices/${id}`);
	return data;
}

export async function createInvoice(body: Partial<Invoice>) {
	const { data } = await api.post<ApiResponse<Invoice>>('/admin/billing/invoices', body);
	return data;
}

export async function updateInvoice(id: number, body: Partial<Invoice>) {
	const { data } = await api.put<ApiResponse<Invoice>>(`/admin/billing/invoices/${id}`, body);
	return data;
}

export async function markInvoicePaid(id: number) {
	const { data } = await api.post<ApiResponse<Invoice>>(
		`/admin/billing/invoices/${id}/paid`
	);
	return data;
}

export async function getInvoicePdfUrl(id: number): Promise<string> {
	return `${api.defaults.baseURL}/admin/billing/invoices/${id}/pdf`;
}

// ─── Ebook Orders ────────────────────────────────────────────────────

export async function getEbookOrders(params?: { page?: number; size?: number }) {
	const { data } = await api.get<ApiResponse<PaginatedData<EbookOrder>>>('/admin/ebooks/orders', {
		params
	});
	return data;
}

export async function getEbookStats() {
	const { data } = await api.get<ApiResponse<Record<string, unknown>>>('/admin/ebooks/stats');
	return data;
}

// ─── Exchange Rates ──────────────────────────────────────────────────

export async function getExchangeRates() {
	const { data } = await api.get<ApiResponse<ExchangeRate[]>>('/exchange-rates');
	return data;
}

export async function getSupportedCurrencies() {
	const { data } = await api.get<ApiResponse<SupportedCurrency[]>>(
		'/exchange-rates/supported-currencies'
	);
	return data;
}

export async function fetchLiveRates() {
	const { data } = await api.post<ApiResponse<void>>('/admin/system/settings/fetch-live-rates');
	return data;
}

// ─── Company Credits ─────────────────────────────────────────────────

export async function addCompanyCredits(companyId: number, amount: number) {
	const { data } = await api.post<ApiResponse<void>>(`/admin/companies/${companyId}/add-credits`, {
		amount
	});
	return data;
}

export async function upgradeCompanyTier(companyId: number, tier: string) {
	const { data } = await api.post<ApiResponse<void>>(
		`/admin/companies/${companyId}/upgrade-tier`,
		{ tier }
	);
	return data;
}
