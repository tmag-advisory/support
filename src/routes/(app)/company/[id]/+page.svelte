<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCompany, freezeCompany, unfreezeCompany } from '$lib/api/company';
	import { addCompanyCredits } from '$lib/api/billing';
	import type { Company } from '$lib/api/types';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, formatNumber } from '$lib/utils';
	import { cn } from '$lib/utils';

	let company: Company | null = $state(null);
	let loading = $state(true);
	let showFreezeConfirm = $state(false);
	let showCreditsModal = $state(false);
	let creditAmount = $state('');

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'team', label: 'Team' },
		{ id: 'credit-requests', label: 'Credit Requests' },
		{ id: 'plans', label: 'Plans' },
		{ id: 'reports', label: 'Reports' },
		{ id: 'settings', label: 'Settings' }
	];

	let currentTab = $state('overview');
	let currentPath = $derived($page.url.pathname);

	onMount(async () => {
		const id = Number($page.params.id);
		try {
			const res = await getCompany(id);
			if (res.success) company = res.data;
		} finally {
			loading = false;
		}
	});

	async function handleFreezeUnfreeze() {
		if (!company) return;
		if (company.status === 'FROZEN') {
			await unfreezeCompany(company.id);
		} else {
			await freezeCompany(company.id);
		}
		const res2 = await getCompany(company.id);
		if (res2.success) company = res2.data;
		showFreezeConfirm = false;
	}

	async function handleAddCredits() {
		if (!company || !creditAmount) return;
		await addCompanyCredits(company.id, Number(creditAmount));
		const res2 = await getCompany(company.id);
		if (res2.success) company = res2.data;
		showCreditsModal = false;
		creditAmount = '';
	}

	function isTabActive(tabId: string): boolean {
		if (tabId === 'overview') return currentPath === `/company/${company?.id}` || currentPath === `/company/${company?.id}/`;
		return currentPath.includes(`/company/${company?.id}/${tabId}`);
	}
</script>

{#if loading}
	<div class="py-12">
		<LoadingSpinner />
	</div>
{:else if company}
	<div class="mb-6 flex items-start justify-between gap-4">
		<div>
			<h1 class="text-xl font-serif text-heading tracking-tight">{company.name}</h1>
			<p class="mt-1 text-sm text-muted">{company.industry || '—'} · {company.billingCurrency || 'USD'}</p>
		</div>
		<div class="flex items-center gap-2 shrink-0">
			<Button variant="outline" onclick={() => (showFreezeConfirm = true)}>
				{company.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
			</Button>
			<Button onclick={() => (showCreditsModal = true)}>Add Credits</Button>
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-border-light mb-6">
		{#each tabs as tab}
			<a
				href="/company/{company.id}/{tab.id === 'overview' ? '' : tab.id}"
				class={cn(
					'relative px-4 py-2.5 text-sm font-medium transition-colors',
					isTabActive(tab.id)
						? 'text-accent'
						: 'text-muted hover:text-body'
				)}
			>
				{tab.label}
				{#if isTabActive(tab.id)}
					<div class="absolute inset-x-0 bottom-0 h-0.5 bg-accent"></div>
				{/if}
			</a>
		{/each}
	</div>

	<!-- Overview tab content -->
	{#if currentTab === 'overview' || currentPath === `/company/${company.id}/`}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<Card>
				{#snippet children()}
					<h3 class="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Basic Info</h3>
					<dl class="space-y-3">
						<div>
							<dt class="text-xs text-muted mb-1">Website</dt>
							<dd class="text-sm text-body">{company?.website || '—'}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Contact Email</dt>
							<dd class="text-sm text-body">{company?.contactEmail || '—'}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Contact Phone</dt>
							<dd class="text-sm text-body">{company?.contactPhone || '—'}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Address</dt>
							<dd class="text-sm text-body">{company?.address || '—'}</dd>
						</div>
					</dl>
				{/snippet}
			</Card>

			<Card>
				{#snippet children()}
					<h3 class="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Billing</h3>
					<dl class="space-y-3">
						<div>
							<dt class="text-xs text-muted mb-1">Credit Balance</dt>
							<dd class="text-2xl font-semibold text-heading">{formatNumber(company?.creditBalance || 0)}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Pricing Tier</dt>
							<dd class="text-sm text-body">{company?.pricingTier || '—'}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Billing Currency</dt>
							<dd class="text-sm text-body">{company?.billingCurrency || 'USD'}</dd>
						</div>
					</dl>
				{/snippet}
			</Card>

			<Card>
				{#snippet children()}
					<h3 class="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Status</h3>
					<dl class="space-y-3">
						<div>
							<dt class="text-xs text-muted mb-1">Account Status</dt>
							<dd><Badge text={company?.status ?? 'Unknown'} /></dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Employees</dt>
							<dd class="text-sm text-body">{company?.employeeCount ?? 0}</dd>
						</div>
						<div>
							<dt class="text-xs text-muted mb-1">Created</dt>
							<dd class="text-sm text-body">{formatDateTime(company?.createdAt)}</dd>
						</div>
					</dl>
				{/snippet}
			</Card>
		</div>
	{/if}

	<!-- Freeze Confirm Modal -->
	<Modal open={showFreezeConfirm} title={company.status === 'FROZEN' ? 'Unfreeze Company' : 'Freeze Company'} onclose={() => (showFreezeConfirm = false)}>
		<p class="text-sm text-body">
			Are you sure you want to {company.status === 'FROZEN' ? 'unfreeze' : 'freeze'} <strong>{company.name}</strong>?
		</p>
		{#snippet footer()}
			<Button variant="secondary" onclick={() => (showFreezeConfirm = false)}>Cancel</Button>
			<Button variant="danger" onclick={handleFreezeUnfreeze}>Confirm</Button>
		{/snippet}
	</Modal>

	<!-- Add Credits Modal -->
	<Modal open={showCreditsModal} title="Add Credits" onclose={() => (showCreditsModal = false)}>
		<div class="mb-4">
			<label for="creditAmount" class="block text-sm font-medium text-heading mb-1">Amount</label>
			<input
				id="creditAmount"
				type="number"
				bind:value={creditAmount}
				class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
			/>
		</div>
		{#snippet footer()}
			<Button variant="secondary" onclick={() => (showCreditsModal = false)}>Cancel</Button>
			<Button onclick={handleAddCredits}>Add Credits</Button>
		{/snippet}
	</Modal>
{/if}