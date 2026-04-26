<script lang="ts">
	import { onMount } from 'svelte';
	import { getDashboardStats } from '$lib/api/technical';
	import type { DashboardStats } from '$lib/api/types';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatNumber, formatCurrency } from '$lib/utils';
	import { Users, Building2, DollarSign, CreditCard, Shield, UserCheck } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';

	let stats = $state<DashboardStats | null>(null);
	let loading = $state(true);
	let user = $derived($authStore.user);

	onMount(async () => {
		try {
			const res = await getDashboardStats();
			if (res.success) {
				stats = res.data;
			}
		} catch {
			// silent
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="py-12">
		<LoadingSpinner />
	</div>
{:else if stats}
	<div class="mb-6">
		<h1 class="text-xl font-serif text-heading tracking-tight">
			Welcome back, {user?.name?.split(' ')[0] || 'Support'}.
		</h1>
		<p class="mt-1 text-sm text-muted">Here's your support operations overview.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<StatCard label="Total Users" value={formatNumber(stats.totalUsers)}>
			{#snippet icon()}
				<Users class="h-5 w-5 text-accent" />
			{/snippet}
		</StatCard>
		<StatCard label="Active Companies" value={formatNumber(stats.activeCompanies)}>
			{#snippet icon()}
				<Building2 class="h-5 w-5 text-accent" />
			{/snippet}
		</StatCard>
		<StatCard label="Credits in Circulation" value={formatNumber(stats.creditsInCirculation)}>
			{#snippet icon()}
				<CreditCard class="h-5 w-5 text-accent" />
			{/snippet}
		</StatCard>
		<StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)}>
			{#snippet icon()}
				<DollarSign class="h-5 w-5 text-accent" />
			{/snippet}
		</StatCard>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<Card>
			{#snippet children()}
				<h3 class="text-base font-semibold text-heading mb-4">Quick Actions</h3>
				<div class="space-y-2">
					<a href="/users" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-button-secondary transition-colors">
						<Users class="h-4 w-4 text-accent shrink-0" />
						<span class="text-body">Search users</span>
					</a>
					<a href="/company" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-button-secondary transition-colors">
						<Building2 class="h-4 w-4 text-accent shrink-0" />
						<span class="text-body">Browse companies</span>
					</a>
					<a href="/billing/invoices" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-button-secondary transition-colors">
						<DollarSign class="h-4 w-4 text-accent shrink-0" />
						<span class="text-body">View invoices</span>
					</a>
					<a href="/technical/abuse" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-button-secondary transition-colors">
						<Shield class="h-4 w-4 text-accent shrink-0" />
						<span class="text-body">Review abuse flags</span>
					</a>
					<a href="/company/onboarding" class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-button-secondary transition-colors">
						<UserCheck class="h-4 w-4 text-accent shrink-0" />
						<span class="text-body">Pending registrations</span>
					</a>
				</div>
			{/snippet}
		</Card>

		<Card>
			{#snippet children()}
				<h3 class="text-base font-semibold text-heading mb-4">Support Guidelines</h3>
				<ul class="space-y-3">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-accent shrink-0">•</span>
						<span class="text-sm text-body">Work from least-privilege access first</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-accent shrink-0">•</span>
						<span class="text-sm text-body">Record every account-impacting action</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-accent shrink-0">•</span>
						<span class="text-sm text-body">Require a ticket ID for sensitive edits</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-accent shrink-0">•</span>
						<span class="text-sm text-body">Escalate medical disputes to Technical</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 text-accent shrink-0">•</span>
						<span class="text-sm text-body">Never share raw API keys or payment tokens</span>
					</li>
				</ul>
			{/snippet}
		</Card>
	</div>
{/if}