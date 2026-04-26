# TMAG Support Reps Playbook

This document defines what support teams can manage across TMAG today, based on implemented app surfaces and backend endpoints.

## Shared Support Principles

- Work from least-privilege access first: prefer company-level tools before super-admin controls.
- Record every account-impacting action (credit adjustment, suspension, deletion, plan flagging, invoice status updates).
- When editing sensitive data (billing, identity, access), require a ticket/reference ID in your internal notes.
- Escalate medical-content disputes and production incidents to the Technical Team.
- Never share raw API keys, full payment tokens, or internal logs with customers.

---

## 1) Billing Team

### Mission

Resolve payment, invoicing, and credit-balance issues for individual and company accounts.

### Main Surfaces

- **Individual billing** in `client` (`/dashboard/settings` — credit purchase section, `/dashboard/transactions`, `/payment/callback`)
- **Company/HR billing** in `client` (`/hr/billing`, `/hr/billing/callback`)
- **Company admin billing** in `admin-dashboard` (`/admin/credits`, `/admin/credits/invoices`, `/admin/credits/callback`)
- **Super-admin billing and ledger** in `super-admin` (`/admin/billing`, `/admin/ledger`)

### What Billing Team Should Manage

#### Credit Purchase Issues
- Failed checkout callbacks for individual credit purchases
- Pending vs completed purchase verification for individuals and companies
- Missing credit balance updates after successful payment (individual and company)
- Volume discount tier misapplication on company purchases
- Currency conversion mismatches on quotes

#### Invoice Operations
- View invoice details and generate PDF invoices
- Mark invoice as paid after verified settlement
- Reconcile invoice history with ledger movements
- Create new invoices for manual billing arrangements
- Update invoice details (amount, company, status)
- Handle overdue and refunded invoice tracking

#### Quote and Pricing Support
- Explain company quote values and currency conversions
- Validate pricing tier applied to company purchase
- Explain individual credit pricing tiers (ESSENTIAL, STANDARD, PREMIUM)
- Clarify per-credit cost vs package pricing for companies (50/100/200 credit packages)
- Support volume discount tier inquiries

#### Ledger Adjustments (Controlled)
- One-off manual correction for under/over-crediting (individual and company)
- Credit reset for individual users
- Audit justification required for every adjustment
- Review credit ledger entries for specific users or companies

#### Ebook Purchase Support
- Troubleshoot ebook checkout failures
- Verify ebook order status and payment completion
- Explain regional edition pricing and currency conversion
- Handle refund requests for duplicate ebook purchases

#### Exchange Rate and Currency Support
- Explain multi-currency billing (USD, NGN, EUR, GBP, and 10+ others)
- Verify exchange rate accuracy and refresh live rates if needed (coordinate with Technical Team)
- Resolve currency mismatch between quote and purchase

### API/Backend Capabilities Used

#### Individual Credit Lifecycle
- `GET /api/v1/credits` — Get credit ledger
- `GET /api/v1/credits/{id}` — Get specific credit entry
- `POST /api/v1/credits` — Create/initiate credit purchase
- `GET /api/v1/credit-pricing` — List credit pricing tiers
- `GET /api/v1/credit-pricing/calculate?credits=X&currency=Y` — Calculate price

#### Company Credit Purchase Lifecycle
- `GET /api/v1/company-admin/credits/pricing` — Get company pricing tiers
- `POST /api/v1/company-admin/credits/quote` — Get credit quote
- `POST /api/v1/company-admin/credits/purchase` — Initiate purchase (returns Flutterwave link)
- `POST /api/v1/company-admin/credits/purchase/hr` — HR-specific purchase flow
- `GET /api/v1/company-admin/credits/verify/{txRef}` — Verify purchase
- `GET /api/v1/company-admin/credits/history` — Purchase history
- `GET /api/v1/company-admin/credits/{txRef}` — Get specific purchase

#### Invoice and Platform Billing (Super-Admin)
- `GET /api/v1/admin/billing/invoices` — List all invoices
- `GET /api/v1/admin/billing/invoices/{id}` — Get invoice detail
- `GET /api/v1/admin/billing/invoices/{id}/pdf` — Generate invoice PDF
- `POST /api/v1/admin/billing/invoices` — Create invoice
- `PUT /api/v1/admin/billing/invoices/{id}` — Update invoice
- `POST /api/v1/admin/billing/invoices/{id}/paid` — Mark invoice paid

#### Ledger Support (Super-Admin)
- `GET /api/v1/admin/ledger` — Get credit ledger (filterable by userId/companyId)
- `POST /api/v1/admin/ledger/adjust` — Adjust credits (add/deduct with reason)

#### User Credit Management (Super-Admin)
- `POST /api/v1/admin/users/{id}/reset-credits` — Reset user credits to specific amount

#### Company Credit Management (Super-Admin)
- `POST /api/v1/admin/companies/{id}/add-credits` — Add credits to company
- `POST /api/v1/admin/companies/{id}/upgrade-tier` — Upgrade company pricing tier

#### Ebook Orders (Super-Admin)
- `GET /api/v1/admin/ebooks/orders` — Get all ebook orders
- `GET /api/v1/admin/ebooks/{id}/orders` — Get orders for specific ebook
- `GET /api/v1/admin/ebooks/stats` — Get ebook sales statistics

#### Exchange Rates
- `GET /api/v1/exchange-rates` — Get current exchange rates
- `GET /api/v1/exchange-rates/supported-currencies` — List supported currencies
- `POST /api/v1/admin/system/settings/fetch-live-rates` — Fetch live rates from external API

### Billing Escalation Rules

**Escalate to Technical Team when:**
- Verify endpoint says completed but credits were not posted
- Callback loops or payment-link errors recur for multiple users
- Exchange-rate refresh or currency mismatch appears systemic
- Flutterwave payment gateway integration failures
- PDF invoice generation errors

**Escalate to Company Assistant when:**
- The issue is role/access confusion, not payment
- Employee credit allocation disputes
- Company onboarding payment status questions

---

## 2) Company Assistant

### Mission

Help company admins and HR users run day-to-day workforce operations: onboarding, employee access, credit requests, reporting, and plan workflows.

### Main Surfaces

- **HR dashboard** in `client` (`/hr`, `/hr/employees`, `/hr/credit-requests`, `/hr/reports`, `/hr/create-plan`)
- **Company admin workspace** in `admin-dashboard` (`/admin/company`, `/admin/team`, `/admin/team/invite`, `/admin/credits`, `/admin/plans`, `/admin/requests`, `/admin/reports`, `/admin/settings`, `/admin/api-keys`, `/admin/audit`, `/admin/settings/export`)
- **Onboarding and invitation flows** in `client` (`/accept-invitation`, `/onboarding`, `/company-onboarding`)

### What Company Assistant Should Manage

#### Team Lifecycle Management
- Invite employees to company (email-based invitations)
- Troubleshoot invite acceptance failures (expired tokens, invalid links)
- Update member roles and status (active, inactive, restricted access)
- Restrict or restore company-user access to platform features
- Remove employee/company users when approved by company admin
- Remind employees to complete onboarding process
- View and manage team member onboarding status

#### Onboarding Support
- Company code validation guidance for new employees joining via company link
- Stage progression checks for stuck onboarding users
- Invitation token and acceptance troubleshooting
- Company onboarding request status tracking (for companies registering on platform)
- Guide users through 4-step company onboarding wizard (Plan Selection, Team Setup, Review, Payment)

#### Credit Governance
- Review and process employee credit requests (approve/reject with justification)
- Explain company credit usage and employee-level consumption
- Allocate credits to specific employees
- Monitor credit request trends and patterns (pending, approved, rejected)

#### Travel Plan Management
- Help create travel plans through HR/company-admin surfaces
- View all company-generated travel plans
- Generate travel plans on behalf of employees
- View plan details: destination, duration, risk score, vaccinations, health alerts, safety advisories
- Troubleshoot plan generation failures or stuck "processing" status

#### Reporting and Data Export
- Download/share usage reports (CSV): employee credit usage, plan consumption
- Download plan history reports (CSV): all travel plans generated under company
- Download compliance documentation reports (CSV): audit trail for compliance requirements
- Download team reports (CSV): employee roster, roles, credit allocations
- Download billing reports (CSV): credit purchases, transactions
- Trigger company-level data export requests (full company data dump)
- View dashboard analytics: credit usage trends, plan statistics, employee activity

#### Company Configuration
- Update company profile details (name, industry, website, contact info, address)
- Manage company billing currency settings
- Manage company API keys (create, view, revoke) for integrations
- Configure company-specific settings (notifications, employee limits, etc.)
- Upload/remove company logo

#### Audit and Compliance
- View company audit log of all admin actions
- Track who performed what action and when
- Export audit trail for compliance reviews

### API/Backend Capabilities Used

#### Team and User Management
- `GET /api/v1/company-admin/team-members` — List company team members
- `GET /api/v1/company-admin/users` — List company users
- `POST /api/v1/company-admin/users` — Create company user
- `PUT /api/v1/company-admin/users/{companyUserId}` — Update company user
- `PUT /api/v1/company-admin/users/{companyUserId}/restrict-access` — Restrict/restore user access
- `DELETE /api/v1/company-admin/users/{companyUserId}` — Delete company user
- `DELETE /api/v1/company-admin/employees/{employeeId}` — Delete employee

#### Invitations and Employee Management
- `POST /api/v1/employees/invite` — Invite employee via email
- `POST /api/v1/employees` — Create employee directly
- `GET /api/v1/employees` — List employees
- `GET /api/v1/employees/{id}` — Get employee detail
- `PUT /api/v1/employees/{id}` — Update employee
- `PUT /api/v1/employees/{id}/credits` — Allocate credits to employee
- `PUT /api/v1/employees/{id}/status` — Update employee status
- `DELETE /api/v1/employees/{id}` — Delete employee
- `POST /api/v1/employees/{id}/remind-onboarding` — Send onboarding reminder

#### Onboarding Support
- `GET /api/v1/onboarding` — Get user onboarding status
- `POST /api/v1/onboarding` — Create/update onboarding
- `PUT /api/v1/onboarding/stage` — Advance onboarding stage
- `GET /api/v1/onboarding/questions` — Get questionnaire
- `POST /api/v1/onboarding/questionnaire` — Submit questionnaire
- `GET /api/v1/onboarding/progress` — Get onboarding progress
- `POST /api/v1/onboarding/progress` — Save progress
- `GET /api/v1/companies/validate-code` — Validate company code

#### Credit Requests and Processing
- `GET /api/v1/credit-requests` — List credit requests (filterable by status)
- `GET /api/v1/credit-requests/{id}` — Get credit request detail
- `POST /api/v1/credit-requests` — Create credit request
- `PUT /api/v1/credit-requests/{id}` — Update credit request
- `POST /api/v1/credit-requests/{id}/approve` — Approve credit request
- `POST /api/v1/credit-requests/{id}/reject` — Reject credit request
- `DELETE /api/v1/credit-requests/{id}` — Delete credit request

#### Travel Plans
- `GET /api/v1/company-admin/plans` — List company travel plans
- `GET /api/v1/company-admin/plans/{id}` — Get plan detail
- `POST /api/v1/company-admin/plans` — Generate travel plan for employee

#### Reports and Analytics
- `GET /api/v1/company-admin/reports/usage` — Get usage report
- `GET /api/v1/company-admin/reports/usage/csv` — Download usage report as CSV
- `GET /api/v1/company-admin/reports/plans` — Get plan history report
- `GET /api/v1/company-admin/reports/plans/csv` — Download plan history as CSV
- `GET /api/v1/company-admin/reports/compliance` — Get compliance report
- `GET /api/v1/company-admin/reports/compliance/csv` — Download compliance report as CSV
- `GET /api/v1/company-admin/reports/dashboard/analytics` — Get dashboard analytics
- `GET /api/v1/company-admin/reports/team` — Get team report
- `GET /api/v1/company-admin/reports/team/csv` — Download team report as CSV

#### Company Configuration
- `GET /api/v1/company-admin/api-keys` — List company API keys
- `POST /api/v1/company-admin/api-keys` — Create API key
- `DELETE /api/v1/company-admin/api-keys/{id}` — Revoke API key
- `GET /api/v1/company-admin/settings` — Get company settings
- `PUT /api/v1/company-admin/settings` — Update company settings
- `PUT /api/v1/company-admin/settings/billing-currency` — Update billing currency
- `GET /api/v1/companies` — List companies
- `GET /api/v1/companies/{id}` — Get company detail
- `PUT /api/v1/companies/{id}` — Update company

#### Data Export
- `GET /api/v1/company-admin/export/company-data` — Export full company data
- `GET /api/v1/company-admin/data-export/employees` — Export employee data
- `GET /api/v1/company-admin/data-export/employees/csv` — Export employee data as CSV
- `GET /api/v1/company-admin/data-export/plans` — Export plan data
- `GET /api/v1/company-admin/data-export/plans/csv` — Export plan data as CSV
- `GET /api/v1/company-admin/data-export/requests` — Export credit request data
- `GET /api/v1/company-admin/data-export/requests/csv` — Export credit requests as CSV
- `GET /api/v1/company-admin/data-export/billing` — Export billing data
- `GET /api/v1/company-admin/data-export/billing/csv` — Export billing data as CSV
- `POST /api/v1/company-admin/data-export/notify` — Notify when export is ready

#### Health Profiles (for employee plan generation)
- `GET /api/v1/health-profiles` — List health profiles
- `GET /api/v1/health-profiles/my` — Get current user's health profile
- `POST /api/v1/health-profiles` — Create health profile
- `PUT /api/v1/health-profiles/{id}` — Update health profile
- `DELETE /api/v1/health-profiles/{id}` — Delete health profile

### Company Assistant Escalation Rules

**Escalate to Billing Team for:**
- Settlement disputes requiring invoice correction
- Payment verification gaps where funds were settled but credits not posted
- Volume discount tier disputes requiring pricing adjustment
- Ebook refund requests requiring financial reversal

**Escalate to Technical Team for:**
- Repeated invitation email failures (SMTP/email service issues)
- Report export crashes or timeouts (large data sets, memory issues)
- Unexpected permission denials for correctly scoped users
- Travel plan generation stuck in QUEUED/PENDING/PROCESSING state for extended periods
- API key creation/revocation failures
- Company data export failures or corrupted exports

---

## 3) Technical Team

### Mission

Own platform stability, security operations, abuse handling, system configuration, content management, and high-impact manual interventions.

### Main Surfaces

- **Super-admin console** in `super-admin` (`/admin/dashboard`, `/admin/users`, `/admin/companies`, `/admin/ai-logs`, `/admin/plans`, `/admin/analytics`, `/admin/system/*`, `/admin/abuse`, `/admin/plan-contexts`, `/admin/ebooks`, `/admin/roles`, `/admin/admin-users`, `/admin/company-registrations`)
- **Spring Boot admin endpoints** in `spring-server` (`/api/v1/admin/*`)

### What Technical Team Should Manage

#### Platform Operations and Monitoring
- Monitor system status and health (database, AI engine, payment gateway, email service)
- View real-time platform metrics: active users, companies, revenue, credits in circulation
- Toggle maintenance mode when performing updates or emergency fixes
- Refresh exchange rates from external APIs and validate conversion health
- Monitor AI operations: success rates, token usage, failures, processing times
- View system logs filtered by severity (info, warning, error, critical)
- Track incidents and response times
- Monitor queue health and async job processing

#### Security and Abuse Management
- Review AI request logs for suspicious activity or policy violations
- Filter AI logs by failures, flagged requests, or high token usage (>3000 tokens)
- Flag specific AI logs for internal review
- Review abuse flags: rapid plan generation, credit bypass attempts, spam, suspicious queries
- Resolve abuse flags after investigation
- Suspend users based on abuse findings
- Monitor severity levels (low, medium, high) across abuse reports
- Investigate permission drift across company/admin scopes

#### User and Company Lifecycle Management
- Full CRUD on any user account (create, view, edit, delete)
- Suspend or reactivate user accounts
- Reset user passwords (with ticket reference)
- Edit user profile details (name, email, phone, location, bio)
- View individual user credit history, ledger entries, and generated plans
- Monitor risk flags on user accounts
- Create companies with initial HR admin accounts
- Edit company details (name, industry, website, contact info, address)
- Freeze or unfreeze companies (restrict access during investigations or payment disputes)
- Add or deduct credits for companies (with audit trail)
- Upgrade company pricing tiers
- Delete companies (requires approval and audit record)
- View company employees, HR admins, and all generated plans

#### Access Governance and RBAC
- Manage admin roles (create, edit, delete roles with custom permissions)
- Manage admin user accounts (create, edit, delete, assign roles)
- Three admin role tiers:
  - **Super Admin**: Full platform access, all admin features
  - **Client Admin**: Manage assigned companies and users
  - **Support Admin**: Read-only access + credit reset capabilities
- View all admin roles and their assigned permissions
- Investigate and resolve permission inconsistencies

#### AI System and Content Control
- Configure AI model version (GPT-4o Mini, GPT-4o, GPT-4 Turbo, Claude 3 Sonnet)
- Set plan generation limits per user
- Upload and manage plan context files (PDFs/text) that influence AI-generated travel plans
- Toggle context files active/inactive to control which references are injected into AI prompts
- Delete outdated or incorrect context files
- Review AI prompt and output summaries for quality assurance
- Monitor token consumption trends and optimize model usage

#### Travel Plan Governance
- Review all user-generated travel plans across the platform
- Filter plans by status: active, flagged, archived, processing, high risk
- View plan details: destination, duration, purpose, risk score, vaccinations, health alerts, safety advisories
- Flag problematic plans for review (incorrect medical advice, suspicious content)
- Archive old or irrelevant plans
- Delete plans entirely (requires audit record)

#### Ebook Catalog Management
- Create new ebooks with full metadata (title, author, descriptions, ISBN, page count, etc.)
- Manage regional editions/versions with country-specific pricing
- Upload PDF files for each edition (via file upload or URL link)
- Set edition pricing in multiple currencies
- Activate/deactivate ebooks and mark as featured
- Edit ebook metadata and existing editions
- Delete ebooks (with confirmation)
- View all ebook orders and buyer information
- Track ebook sales revenue by title and region

#### Company Onboarding Review
- Review incoming company registration requests
- View submitted company details, selected plans, team members, payment status, and sample use cases
- Approve requests (creates company entity and sends team invitations)
- Reject requests with reason (notifies applicant via email)
- Track onboarding request status (pending, approved, rejected)

#### Data and Incident Management
- Coordinate with Billing Team before manual ledger edits tied to open payment disputes
- Coordinate with Company Assistant before deleting company/user records to avoid business workflow disruption
- For data deletion actions, require explicit approval and immutable audit records
- Run root-cause analysis for recurring callback, auth, queue, or reporting failures
- Manage system-wide incidents and post-mortem documentation

#### Blog and Content Management
- Manage blog posts (create, edit, delete, upload featured images)
- Manage FAQ items (create, edit, delete)
- Manage contact form submissions
- Manage newsletter subscriptions

#### Country and Health Alert Management
- Manage country list (create, edit, delete countries)
- Create and manage country health alerts (disease outbreaks, travel advisories)
- Manage country accommodation information
- Keep health alert data current for travel plan accuracy

### API/Backend Capabilities Used

#### System Controls
- `GET /api/v1/admin/dashboard/stats` — Dashboard statistics
- `GET /api/v1/admin/system/status` — System health status
- `GET /api/v1/admin/system/logs` — System logs (filterable by level)
- `GET /api/v1/admin/system/settings` — System settings
- `PUT /api/v1/admin/system/settings` — Update system settings
- `POST /api/v1/admin/system/settings/toggle-maintenance` — Toggle maintenance mode
- `POST /api/v1/admin/system/settings/fetch-live-rates` — Fetch live exchange rates

#### Security and Abuse
- `GET /api/v1/admin/ai-logs` — List AI logs (filterable by userId, status)
- `GET /api/v1/admin/ai-logs/{id}` — Get AI log detail
- `POST /api/v1/admin/ai-logs/{id}/flag` — Flag AI log
- `GET /api/v1/admin/abuse` — List abuse flags (filterable by resolved status)
- `POST /api/v1/admin/abuse/{id}/resolve` — Resolve abuse flag

#### User/Company Controls
- `GET /api/v1/admin/users` — List all users
- `GET /api/v1/admin/users/{id}` — Get user detail
- `POST /api/v1/admin/users` — Create user
- `PUT /api/v1/admin/users/{id}` — Update user
- `POST /api/v1/admin/users/{id}/suspend` — Suspend user
- `POST /api/v1/admin/users/{id}/activate` — Activate user
- `POST /api/v1/admin/users/{id}/reset-credits` — Reset user credits
- `POST /api/v1/admin/users/{id}/reset-password` — Reset user password
- `DELETE /api/v1/admin/users/{id}` — Delete user
- `GET /api/v1/admin/companies` — List companies
- `GET /api/v1/admin/companies/{id}` — Get company detail
- `GET /api/v1/admin/companies/{id}/employees` — Get company employees
- `POST /api/v1/admin/companies` — Create company
- `PUT /api/v1/admin/companies/{id}` — Update company
- `POST /api/v1/admin/companies/{id}/freeze` — Freeze company
- `POST /api/v1/admin/companies/{id}/unfreeze` — Unfreeze company
- `POST /api/v1/admin/companies/{id}/add-credits` — Add credits to company
- `POST /api/v1/admin/companies/{id}/upgrade-tier` — Upgrade company tier
- `DELETE /api/v1/admin/companies/{id}` — Delete company

#### Governance and Advanced Admin
- `GET /api/v1/admin/roles` — List roles
- `GET /api/v1/admin/roles/{id}` — Get role detail
- `POST /api/v1/admin/roles` — Create role
- `PUT /api/v1/admin/roles/{id}` — Update role
- `DELETE /api/v1/admin/roles/{id}` — Delete role
- `GET /api/v1/admin/admin-users` — List admin users
- `GET /api/v1/admin/admin-users/{id}` — Get admin user detail
- `POST /api/v1/admin/admin-users` — Create admin user
- `PUT /api/v1/admin/admin-users/{id}` — Update admin user
- `DELETE /api/v1/admin/admin-users/{id}` — Delete admin user

#### Plan Context Management
- `GET /api/v1/admin/plan-contexts` — List plan contexts
- `POST /api/v1/admin/plan-contexts` — Upload plan context (multipart/form-data)
- `PUT /api/v1/admin/plan-contexts/{id}/active` — Toggle active status
- `DELETE /api/v1/admin/plan-contexts/{id}` — Delete plan context

#### Travel Plan Oversight
- `GET /api/v1/admin/plans` — List generated plans (filterable by status)
- `GET /api/v1/admin/plans/{id}` — Get plan detail
- `POST /api/v1/admin/plans/{id}/flag` — Flag plan
- `POST /api/v1/admin/plans/{id}/archive` — Archive plan
- `DELETE /api/v1/admin/plans/{id}` — Delete plan

#### Ebook Management
- `GET /api/v1/admin/ebooks` — List ebooks
- `POST /api/v1/admin/ebooks` — Create ebook
- `PUT /api/v1/admin/ebooks/{id}` — Update ebook
- `DELETE /api/v1/admin/ebooks/{id}` — Delete ebook
- `POST /api/v1/admin/ebooks/{id}/versions` — Add version/edition
- `PUT /api/v1/admin/ebooks/{id}/versions/{versionId}` — Update version
- `DELETE /api/v1/admin/ebooks/{id}/versions/{versionId}` — Delete version
- `GET /api/v1/admin/ebooks/orders` — Get all ebook orders
- `GET /api/v1/admin/ebooks/{id}/orders` — Get orders for specific ebook
- `GET /api/v1/admin/ebooks/stats` — Get ebook statistics
- `POST /api/v1/admin/ebooks/upload-pdf` — Upload PDF file (multipart/form-data)

#### Company Onboarding Review
- `GET /api/v1/admin/company-onboarding` — List onboarding requests (filterable by status)
- `GET /api/v1/admin/company-onboarding/{id}` — Get onboarding request detail
- `POST /api/v1/admin/company-onboarding/{id}/approve` — Approve and create company
- `POST /api/v1/admin/company-onboarding/{id}/reject` — Reject with reason

#### Analytics and Reporting
- `GET /api/v1/admin/analytics` — Get analytics data (usage, destinations, credits, revenue)

#### Blog and Content
- `GET /api/v1/blog-posts` — List blog posts
- `GET /api/v1/blog-posts/{id}` — Get blog post
- `POST /api/v1/blog-posts` — Create blog post
- `PUT /api/v1/blog-posts/{id}` — Update blog post
- `DELETE /api/v1/blog-posts/{id}` — Delete blog post
- `GET /api/v1/faq-items` — List FAQ items
- `GET /api/v1/faq-items/{id}` — Get FAQ item
- `POST /api/v1/faq-items` — Create FAQ item
- `PUT /api/v1/faq-items/{id}` — Update FAQ item
- `DELETE /api/v1/faq-items/{id}` — Delete FAQ item
- `GET /api/v1/contacts` — List contact submissions
- `POST /api/v1/newsletter/subscribe` — Subscribe to newsletter

#### Country and Alert Management
- `GET /api/v1/countries` — List countries
- `POST /api/v1/countries` — Create country
- `PUT /api/v1/countries/{id}` — Update country
- `DELETE /api/v1/countries/{id}` — Delete country
- `GET /api/v1/country-health-alerts` — List health alerts
- `POST /api/v1/country-health-alerts` — Create health alert
- `PUT /api/v1/country-health-alerts/{id}` — Update health alert
- `DELETE /api/v1/country-health-alerts/{id}` — Delete health alert
- `GET /api/v1/country-accommodations` — List accommodations
- `POST /api/v1/country-accommodations` — Create accommodation
- `PUT /api/v1/country-accommodations/{id}` — Update accommodation
- `DELETE /api/v1/country-accommodations/{id}` — Delete accommodation

### Technical Team Escalation Rules

**Coordinate with Billing Team before:**
- Manual ledger edits tied to open payment disputes
- Credit adjustments that affect unresolved invoices
- Company tier changes with active billing negotiations

**Coordinate with Company Assistant before:**
- Deleting company or user records to avoid business workflow disruption
- Freezing/unfreezing companies with active employee onboarding
- Revoking API keys used in active company integrations

**For data deletion actions:**
- Require explicit approval from team lead or management
- Create immutable audit records documenting what was deleted and why
- Verify backups exist before irreversible deletions

---

## Cross-Team Handoff Matrix

| Scenario | Owner | Escalation Path |
|---|---|---|
| Billing issue + no funds settled yet | Billing Team | — |
| Billing issue + settled funds but missing credits | Billing Team opens Technical escalation | Billing → Technical |
| Employee onboarding/invite issue | Company Assistant | — |
| Permission/role model contradiction | Company Assistant triages, Technical Team resolves | Company Assistant → Technical |
| Abuse/security or platform outage | Technical Team | — |
| Credit request dispute (employee disagrees with decision) | Company Assistant | — |
| Invoice correction requiring ledger adjustment | Billing Team | Billing → Technical (for ledger edit) |
| Report export crash | Company Assistant opens Technical escalation | Company Assistant → Technical |
| Company registration review | Technical Team | — |
| Ebook purchase refund | Billing Team | — |
| Travel plan flagged for incorrect medical advice | Technical Team | Technical → Company Assistant (notify affected company) |

---

## Suggested Operational SLAs

| Priority | Description | Response Time |
|---|---|---|
| **P1** | Platform down, auth outage, payment verification broken | Within 15 minutes |
| **P2** | Company blocked from onboarding or billing callback stuck | Within 1 hour |
| **P3** | Single-account billing mismatch, invitation issue | Within 4 business hours |
| **P4** | Reporting questions, configuration help | Within 1 business day |

---

## Notes For Future Expansion

- Keep this file aligned with route/API changes in:
  - `client/src/routes/route.tsx`
  - `admin-dashboard/src/routes/route.tsx`
  - `super-admin/src/routes/router.tsx`
  - `spring-server/src/main/java/com/TravelMedicineAdvisory/Server/domain/**`
- Add explicit RBAC mapping (role -> action matrix) once permission catalogs are finalized in production.
- Consider adding runbooks for common scenarios (payment callback stuck, invite email bounce, plan generation timeout).
- Document integration points with third-party services (Flutterwave, AI provider, email service, exchange rate API).
