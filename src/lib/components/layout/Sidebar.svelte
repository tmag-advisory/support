<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { authStore, ROLE_SECTIONS } from '$lib/stores/auth';
	import { sidebarOpen } from '$lib/stores/sidebar';
	import type { AdminRole } from '$lib/api/types';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard,
		CreditCard,
		FileText,
		Receipt,
		BookOpen,
		BarChart3,
		Building2,
		Users,
		Map,
		Settings,
		Shield,
		AlertTriangle,
		Flag,
		FileStack,
		UsersRound,
		BookMarked,
		GraduationCap,
		FilePen,
		HelpCircle,
		Mail,
		Globe,
		X,
		LogOut,
		Coins,
		Server,
		Bug
	} from 'lucide-svelte';
	import { clearTokenCookie } from '$lib/api/axios';

	interface NavItem {
		label: string;
		href: string;
		icon: typeof LayoutDashboard;
	}

	type NavSection = {
		title: string;
		items: NavItem[];
	};

	const billingNav: NavSection = {
		title: 'Billing',
		items: [
			{ label: 'Credits', href: '/billing/credits', icon: CreditCard },
			{ label: 'Invoices', href: '/billing/invoices', icon: Receipt },
			{ label: 'Ledger', href: '/billing/ledger', icon: Coins },
			{ label: 'Pricing Tiers', href: '/billing/pricing', icon: FileText },
			{ label: 'Ebook Orders', href: '/billing/ebooks', icon: BookOpen },
			{ label: 'Exchange Rates', href: '/billing/exchange-rates', icon: BarChart3 }
		]
	};

	const companyNav: NavSection = {
		title: 'Company Assistant',
		items: [
			{ label: 'Companies', href: '/company', icon: Building2 },
			{ label: 'Credit Requests', href: '/requests', icon: FileText }
		]
	};

	const userNav: NavSection = {
		title: 'Users',
		items: [
			{ label: 'All Users', href: '/users', icon: Users }
		]
	};

	const plansNav: NavSection = {
		title: 'Travel Plans',
		items: [
			{ label: 'All Plans', href: '/plans', icon: Map }
		]
	};

	const technicalNav: NavSection = {
		title: 'Technical Team',
		items: [
			{ label: 'Company Registrations', href: '/company/onboarding', icon: GraduationCap },
			{ label: 'System Status', href: '/technical/system', icon: Server },
			{ label: 'System Logs', href: '/technical/logs', icon: Bug },
			{ label: 'AI Logs', href: '/technical/ai-logs', icon: Flag },
			{ label: 'Abuse Flags', href: '/technical/abuse', icon: AlertTriangle },
			{ label: 'Plan Contexts', href: '/technical/plan-contexts', icon: FileStack },
			{ label: 'Roles', href: '/technical/roles', icon: Shield },
			{ label: 'Admin Users', href: '/technical/admin-users', icon: UsersRound },
			{ label: 'Ebooks', href: '/technical/ebooks', icon: BookMarked },
			{ label: 'Blog', href: '/technical/blog', icon: FilePen },
			{ label: 'FAQ', href: '/technical/faq', icon: HelpCircle },
			{ label: 'Contacts', href: '/technical/contacts', icon: Mail },
			{ label: 'Countries', href: '/technical/countries', icon: Globe }
		]
	};

	const analyticsNav: NavSection = {
		title: 'Analytics',
		items: [
			{ label: 'Platform Analytics', href: '/analytics', icon: BarChart3 }
		]
	};

	function getSections(role: AdminRole | undefined): NavSection[] {
		if (!role) return [];
		const allowed = (ROLE_SECTIONS[role] || []) as readonly string[];
		const all: NavSection[] = [];
		if (allowed.includes('dashboard')) all.push({ title: 'Overview', items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] });
		if (allowed.includes('billing')) all.push(billingNav);
		if (allowed.includes('company')) all.push(companyNav);
		if (allowed.includes('users')) all.push(userNav);
		if (allowed.includes('plans')) all.push(plansNav);
		if (allowed.includes('technical')) all.push(technicalNav);
		if (allowed.includes('analytics')) all.push(analyticsNav);
		return all;
	}

	function isActive(href: string, path: string): boolean {
		if (href === '/dashboard') return path === '/dashboard';
		return path.startsWith(href);
	}

	let currentPath = $derived($page.url.pathname);
	let user = $derived($authStore.user);
	let sections = $derived(getSections(user?.role as AdminRole));

	function handleLogout() {
		clearTokenCookie();
		authStore.logout();
		goto('/login');
	}

	function handleNav() {
		sidebarOpen.set(false);
	}
</script>

<aside
	class={cn(
		'fixed top-0 left-0 h-screen w-64 bg-darkest text-white flex flex-col z-40 transition-transform duration-300',
		$sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
	)}
>
	<!-- Logo -->
	<div class="flex items-center justify-between px-6 py-6 border-b border-white/6">
		<a href="/dashboard" class="flex flex-col gap-0.5" onclick={handleNav}>
			<span class="text-xl font-serif font-medium tracking-tight text-white">TMAG</span>
			<span class="text-[10px] text-white/40 uppercase tracking-widest">Support</span>
		</a>
		<button
			onclick={() => sidebarOpen.set(false)}
			class="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
		>
			<X class="w-4 h-4 text-white/50" />
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
		{#each sections as section}
			<div>
				<p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
					{section.title}
				</p>
				<div class="space-y-0.5">
					{#each section.items as item}
						<a
							href={item.href}
							onclick={handleNav}
							class={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
								isActive(item.href, currentPath)
									? 'bg-white/10 text-white'
									: 'text-white/45 hover:text-white hover:bg-white/4'
							)}
						>
							<item.icon class="w-4 h-4 shrink-0" />
							{item.label}
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</nav>

	<!-- User info + logout -->
	<div class="px-4 py-4 border-t border-white/6">
		<div class="flex items-center gap-3 mb-3 px-2">
			<div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70 font-serif">
				{user?.name?.charAt(0)?.toUpperCase() || '?'}
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-sm font-medium text-white truncate">{user?.name || ''}</p>
				<p class="text-xs text-white/30 truncate capitalize">
					{user?.role?.replace('_', ' ') || ''}
				</p>
			</div>
		</div>
		<button
			onclick={handleLogout}
			class="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/4 transition-colors duration-150 cursor-pointer"
		>
			<LogOut class="w-4 h-4" />
			Sign out
		</button>
	</div>
</aside>
