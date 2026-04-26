import api from './axios';
import type {
  ApiResponse,
  PaginatedData,
  DashboardStats,
  SystemStatus,
  SystemLog,
  AiLog,
  AbuseFlag,
  Role,
  AdminUser,
  PlanContext,
  GeneratedPlan,
  Ebook,
  EbookVersion,
  BlogPost,
  FaqItem,
  ContactSubmission,
  Country,
  HealthAlert,
  AnalyticsData,
  User,
  Company,
  SystemSetting
} from './types';

// ─── Dashboard ───────────────────────────────────────────────────────

export async function getDashboardStats() {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  return data;
}

// ─── System ──────────────────────────────────────────────────────────

export async function getSystemStatus() {
  const { data } = await api.get<ApiResponse<SystemStatus>>('/admin/system/status');
  return data;
}

export async function getSystemLogs(params?: {
  level?: string;
  page?: number;
  size?: number;
}) {
  const { data } = await api.get<ApiResponse<PaginatedData<SystemLog>>>('/admin/system/logs', {
    params
  });
  return data;
}

export async function getSystemSettings() {
  const { data } = await api.get<ApiResponse<SystemSetting[]>>('/admin/system/settings');
  return data;
}

export async function updateSystemSettings(settings: Record<string, string>) {
  const { data } = await api.put<ApiResponse<void>>('/admin/system/settings', settings);
  return data;
}

export async function toggleMaintenance() {
  const { data } = await api.post<ApiResponse<void>>('/admin/system/settings/toggle-maintenance');
  return data;
}

// ─── AI Logs ─────────────────────────────────────────────────────────

export async function getAiLogs(params?: {
  userId?: number;
  status?: string;
  flagged?: boolean;
  page?: number;
  size?: number;
}) {
  const { data } = await api.get<ApiResponse<PaginatedData<AiLog>>>('/admin/ai-logs', {
    params
  });
  return data;
}

export async function getAiLog(id: number) {
  const { data } = await api.get<ApiResponse<AiLog>>(`/admin/ai-logs/${id}`);
  return data;
}

export async function flagAiLog(id: number, reason?: string) {
  const { data } = await api.post<ApiResponse<AiLog>>(`/admin/ai-logs/${id}/flag`, { reason });
  return data;
}

// ─── Abuse ───────────────────────────────────────────────────────────

export async function getAbuseFlags(params?: { resolved?: boolean; page?: number; size?: number }) {
  const { data } = await api.get<ApiResponse<PaginatedData<AbuseFlag>>>('/admin/abuse', {
    params
  });
  return data;
}

export async function resolveAbuseFlag(id: number) {
  const { data } = await api.post<ApiResponse<AbuseFlag>>(`/admin/abuse/${id}/resolve`);
  return data;
}

// ─── Roles ───────────────────────────────────────────────────────────

export async function getRoles() {
  const { data } = await api.get<ApiResponse<Role[]>>('/admin/roles');
  return data;
}

export async function getRole(id: number) {
  const { data } = await api.get<ApiResponse<Role>>(`/admin/roles/${id}`);
  return data;
}

export async function createRole(body: Partial<Role>) {
  const { data } = await api.post<ApiResponse<Role>>('/admin/roles', body);
  return data;
}

export async function updateRole(id: number, body: Partial<Role>) {
  const { data } = await api.put<ApiResponse<Role>>(`/admin/roles/${id}`, body);
  return data;
}

export async function deleteRole(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/roles/${id}`);
  return data;
}

// ─── Admin Users ─────────────────────────────────────────────────────

export async function getAdminUsers() {
  const { data } = await api.get<ApiResponse<AdminUser[]>>('/admin/admin-users');
  return data;
}

export async function getAdminUser(id: number) {
  const { data } = await api.get<ApiResponse<AdminUser>>(`/admin/admin-users/${id}`);
  return data;
}

export async function createAdminUser(body: Partial<AdminUser> & { password: string }) {
  const { data } = await api.post<ApiResponse<AdminUser>>('/admin/admin-users', body);
  return data;
}

export async function updateAdminUser(id: number, body: Partial<AdminUser>) {
  const { data } = await api.put<ApiResponse<AdminUser>>(`/admin/admin-users/${id}`, body);
  return data;
}

export async function deleteAdminUser(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/admin-users/${id}`);
  return data;
}

// ─── Plan Contexts ───────────────────────────────────────────────────

export async function getPlanContexts() {
  const { data } = await api.get<ApiResponse<PlanContext[]>>('/admin/plan-contexts');
  return data;
}

export async function uploadPlanContext(formData: FormData) {
  const { data } = await api.post<ApiResponse<PlanContext>>('/admin/plan-contexts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function togglePlanContextActive(id: number) {
  const { data } = await api.put<ApiResponse<PlanContext>>(
    `/admin/plan-contexts/${id}/active`
  );
  return data;
}

export async function deletePlanContext(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/plan-contexts/${id}`);
  return data;
}

// ─── Plans ───────────────────────────────────────────────────────────

export async function getPlans(params?: {
  status?: string;
  userId?: number;
  page?: number;
  size?: number;
}) {
  const { data } = await api.get<ApiResponse<PaginatedData<GeneratedPlan>>>('/admin/plans', {
    params
  });
  return data;
}

export async function getPlan(id: number) {
  const { data } = await api.get<ApiResponse<GeneratedPlan>>(`/admin/plans/${id}`);
  return data;
}

export async function flagPlan(id: number) {
  const { data } = await api.post<ApiResponse<void>>(`/admin/plans/${id}/flag`);
  return data;
}

export async function archivePlan(id: number) {
  const { data } = await api.post<ApiResponse<void>>(`/admin/plans/${id}/archive`);
  return data;
}

export async function deletePlan(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/plans/${id}`);
  return data;
}

// ─── Users ───────────────────────────────────────────────────────────

export async function getUsers(params?: { search?: string; page?: number; size?: number }) {
  const { data } = await api.get<ApiResponse<PaginatedData<User>>>('/admin/users', { params });
  return data;
}

export async function getUser(id: number) {
  const { data } = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
  return data;
}

export async function updateUser(id: number, body: Partial<User>) {
  const { data } = await api.put<ApiResponse<User>>(`/admin/users/${id}`, body);
  return data;
}

export async function suspendUser(id: number) {
  const { data } = await api.post<ApiResponse<void>>(`/admin/users/${id}/suspend`);
  return data;
}

export async function activateUser(id: number) {
  const { data } = await api.post<ApiResponse<void>>(`/admin/users/${id}/activate`);
  return data;
}

export async function resetUserPassword(id: number) {
  const { data } = await api.post<ApiResponse<void>>(`/admin/users/${id}/reset-password`);
  return data;
}

export async function deleteUser(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/users/${id}`);
  return data;
}

// ─── Ebooks ──────────────────────────────────────────────────────────

export async function getEbooks() {
  const { data } = await api.get<ApiResponse<Ebook[]>>('/admin/ebooks');
  return data;
}

export async function getEbook(id: number) {
  const { data } = await api.get<ApiResponse<Ebook>>(`/admin/ebooks/${id}`);
  return data;
}

export async function createEbook(body: Partial<Ebook>) {
  const { data } = await api.post<ApiResponse<Ebook>>('/admin/ebooks', body);
  return data;
}

export async function updateEbook(id: number, body: Partial<Ebook>) {
  const { data } = await api.put<ApiResponse<Ebook>>(`/admin/ebooks/${id}`, body);
  return data;
}

export async function deleteEbook(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/admin/ebooks/${id}`);
  return data;
}

export async function addEbookVersion(ebookId: number, body: Partial<EbookVersion>) {
  const { data } = await api.post<ApiResponse<EbookVersion>>(
    `/admin/ebooks/${ebookId}/versions`,
    body
  );
  return data;
}

export async function updateEbookVersion(
  ebookId: number,
  versionId: number,
  body: Partial<EbookVersion>
) {
  const { data } = await api.put<ApiResponse<EbookVersion>>(
    `/admin/ebooks/${ebookId}/versions/${versionId}`,
    body
  );
  return data;
}

export async function deleteEbookVersion(ebookId: number, versionId: number) {
  const { data } = await api.delete<ApiResponse<void>>(
    `/admin/ebooks/${ebookId}/versions/${versionId}`
  );
  return data;
}

export async function uploadEbookPdf(formData: FormData) {
  const { data } = await api.post<ApiResponse<{ url: string }>>('/admin/ebooks/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

// ─── Blog ────────────────────────────────────────────────────────────

export async function getBlogPosts(params?: { page?: number; size?: number }) {
  const { data } = await api.get<ApiResponse<PaginatedData<BlogPost>>>('/blog-posts', {
    params
  });
  return data;
}

export async function getBlogPost(id: number) {
  const { data } = await api.get<ApiResponse<BlogPost>>(`/blog-posts/${id}`);
  return data;
}

export async function createBlogPost(body: Partial<BlogPost>) {
  const { data } = await api.post<ApiResponse<BlogPost>>('/blog-posts', body);
  return data;
}

export async function updateBlogPost(id: number, body: Partial<BlogPost>) {
  const { data } = await api.put<ApiResponse<BlogPost>>(`/blog-posts/${id}`, body);
  return data;
}

export async function deleteBlogPost(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/blog-posts/${id}`);
  return data;
}

// ─── FAQ ─────────────────────────────────────────────────────────────

export async function getFaqItems() {
  const { data } = await api.get<ApiResponse<FaqItem[]>>('/faq-items');
  return data;
}

export async function createFaqItem(body: Partial<FaqItem>) {
  const { data } = await api.post<ApiResponse<FaqItem>>('/faq-items', body);
  return data;
}

export async function updateFaqItem(id: number, body: Partial<FaqItem>) {
  const { data } = await api.put<ApiResponse<FaqItem>>(`/faq-items/${id}`, body);
  return data;
}

export async function deleteFaqItem(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/faq-items/${id}`);
  return data;
}

// ─── Contacts ────────────────────────────────────────────────────────

export async function getContacts(params?: { page?: number; size?: number }) {
  const { data } = await api.get<ApiResponse<PaginatedData<ContactSubmission>>>('/contacts', {
    params
  });
  return data;
}

// ─── Countries ───────────────────────────────────────────────────────

export async function getCountries() {
  const { data } = await api.get<ApiResponse<Country[]>>('/countries');
  return data;
}

export async function createCountry(body: Partial<Country>) {
  const { data } = await api.post<ApiResponse<Country>>('/countries', body);
  return data;
}

export async function updateCountry(id: number, body: Partial<Country>) {
  const { data } = await api.put<ApiResponse<Country>>(`/countries/${id}`, body);
  return data;
}

export async function deleteCountry(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/countries/${id}`);
  return data;
}

export async function getHealthAlerts() {
  const { data } = await api.get<ApiResponse<HealthAlert[]>>('/country-health-alerts');
  return data;
}

export async function createHealthAlert(body: Partial<HealthAlert>) {
  const { data } = await api.post<ApiResponse<HealthAlert>>('/country-health-alerts', body);
  return data;
}

export async function updateHealthAlert(id: number, body: Partial<HealthAlert>) {
  const { data } = await api.put<ApiResponse<HealthAlert>>(
    `/country-health-alerts/${id}`,
    body
  );
  return data;
}

export async function deleteHealthAlert(id: number) {
  const { data } = await api.delete<ApiResponse<void>>(`/country-health-alerts/${id}`);
  return data;
}

// ─── Analytics ───────────────────────────────────────────────────────

export async function getAnalytics(params?: { startDate?: string; endDate?: string }) {
  const { data } = await api.get<ApiResponse<AnalyticsData>>('/admin/analytics', { params });
  return data;
}
