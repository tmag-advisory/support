export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface PaginatedData<T> {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number;
}

// ─── Auth ────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type AdminRole = 'super_admin' | 'client_admin' | 'support_admin';

export interface LoginResponse {
  token: string;
  exp: number;
  user: AdminUser;
}

// ─── User ────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  role?: string;
  creditBalance?: number;
  onboarded?: boolean;
  onboardingStage?: number;
  status?: string;
  riskFlags?: string[];
  createdAt?: string;
  updatedAt?: string;
  company?: Company;
}

// ─── Company ─────────────────────────────────────────────────────────

export interface Company {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  creditsPurchased?: number;
  creditsRemaining?: number;
  creditBalance?: number;
  plansGenerated?: number;
  activeEmployees?: number;
  employeeCount?: number;
  billingStatus?: string;
  status?: string;
  contractRenewal?: string | null;
  tier?: string;
  pricingTier?: string;
  hrAdmins?: any[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  billingCurrency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role?: string;
  status?: string;
  credits?: number;
  onboarded?: boolean;
  createdAt?: string;
}

// ─── Credits ─────────────────────────────────────────────────────────

export interface CreditEntry {
  id: number;
  userId?: number;
  userEmail?: string;
  companyId?: number;
  companyName?: string;
  amount: number;
  type: string;
  description?: string;
  balance?: number;
  createdAt?: string;
}

export interface CreditPricing {
  tier: string;
  pricePerCredit: number;
  currency: string;
  minCredits: number;
  maxCredits: number;
}

export interface CreditRequest {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  companyId?: number;
  companyName?: string;
  amount: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

// ─── Invoice ─────────────────────────────────────────────────────────

export interface Invoice {
  id: number;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  status: string;
  companyId?: number;
  companyName?: string;
  userId?: number;
  userEmail?: string;
  description?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Travel Plans ────────────────────────────────────────────────────

export interface GeneratedPlan {
  id: number;
  userId?: number;
  userEmail?: string;
  companyId?: number;
  destination?: string;
  duration?: string;
  purpose?: string;
  riskScore?: number;
  status: string;
  vaccinations?: string[];
  healthAlerts?: string[];
  safetyAdvisories?: string[];
  createdAt?: string;
}

// ─── AI Logs ─────────────────────────────────────────────────────────

export interface AiLog {
  id: number;
  userId?: number;
  userEmail?: string;
  model?: string;
  tokensUsed?: number;
  planGenerationTokensUsed?: number;
  summaryGenerationTokensUsed?: number;
  status: string;
  promptSummary?: string;
  responseSummary?: string;
  flagged?: boolean;
  flagReason?: string;
  createdAt?: string;
}

// ─── Abuse ───────────────────────────────────────────────────────────

export interface AbuseFlag {
  id: number;
  userId?: number;
  userEmail?: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt?: string;
}

// ─── Ebook ───────────────────────────────────────────────────────────

export interface Ebook {
  id: number;
  title: string;
  author?: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
  featured?: boolean;
  active?: boolean;
  versions?: EbookVersion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EbookVersion {
  id: number;
  ebookId: number;
  region?: string;
  price: number;
  currency: string;
  fileUrl?: string;
  createdAt?: string;
}

export interface EbookOrder {
  id: number;
  ebookId: number;
  ebookTitle?: string;
  userId?: number;
  userEmail?: string;
  versionId?: number;
  region?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt?: string;
}

// ─── System ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  activeCompanies: number;
  totalRevenue: number;
  creditsInCirculation: number;
  activePlans?: number;
  pendingRequests?: number;
}

export interface SystemStatus {
  database: string;
  aiEngine: string;
  paymentGateway: string;
  emailService: string;
  redis?: string;
  overall: string;
}

export interface SystemLog {
  id: number;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source?: string;
  createdAt?: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
}

// ─── Roles ───────────────────────────────────────────────────────────

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

// ─── Plan Context ────────────────────────────────────────────────────

export interface PlanContext {
  id: number;
  name: string;
  description?: string;
  fileUrl?: string;
  active: boolean;
  createdAt?: string;
}

// ─── Company Onboarding ──────────────────────────────────────────────

export interface CompanyOnboardingRequest {
  id: number;
  companyName: string;
  contactEmail: string;
  contactName: string;
  industry?: string;
  teamSize?: number;
  selectedPlan?: string;
  paymentStatus?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt?: string;
  resolvedAt?: string;
}

// ─── Content ─────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  featuredImage?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  active?: boolean;
  createdAt?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  active: boolean;
  createdAt?: string;
}

// ─── Country & Health ────────────────────────────────────────────────

export interface Country {
  id: number;
  name: string;
  code: string;
  region?: string;
  riskLevel?: string;
  createdAt?: string;
}

export interface HealthAlert {
  id: number;
  countryId: number;
  countryName?: string;
  title: string;
  description: string;
  severity: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountryAccommodation {
  id: number;
  countryId: number;
  name: string;
  type?: string;
  description?: string;
  contact?: string;
  createdAt?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────

export interface AnalyticsData {
  userGrowth?: { date: string; count: number }[];
  revenue?: { date: string; amount: number }[];
  topDestinations?: { destination: string; count: number }[];
  creditConsumption?: { date: string; amount: number }[];
  planGeneration?: { date: string; count: number }[];
}

// ─── Exchange Rates ──────────────────────────────────────────────────

export interface ExchangeRate {
  currency: string;
  rate: number;
  symbol?: string;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
}
