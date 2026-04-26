<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCreditLedger, resetUserCredits } from '$lib/api/billing';
	import { getUser } from '$lib/api/technical';
	import type { CreditEntry, User } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, formatNumber } from '$lib/utils';

	let user: User | null = $state(null);
	let entries: CreditEntry[] = $state([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let showResetModal = $state(false);
	let resetAmount = $state('');

	async function loadData() {
		loading = true;
		try {
			const userId = Number($page.params.id);
			const [u, ledger] = await Promise.all([
				getUser(userId),
				getCreditLedger({ userId, page: currentPage, size: 20 })
			]);
			if (u.success) user = u.data;
			if (ledger.success) {
				entries = ledger.data.content ?? [];
				totalPages = ledger.data.totalPages ?? 0;
			}
		} finally {
			loading = false;
		}
	}

	async function handleResetCredits() {
		if (!user || !resetAmount) return;
		await resetUserCredits(user.id, Number(resetAmount));
		showResetModal = false;
		resetAmount = '';
		await loadData();
	}

	onMount(() => {
		loadData();
	});

	$effect(() => {
		currentPage;
		loadData();
	});
</script>

{#if loading}
	<LoadingSpinner />
{:else}
	<PageHeader
		title="Credits - {user?.name ?? ''}"
		description="View and manage credit entries"
	>
		{#snippet action()}
			<div class="flex gap-2">
				<a href="/users/{$page.params.id}" class="text-sm text-muted hover:underline">
					&larr; Back to user
				</a>
				<Button onclick={() => (showResetModal = true)}>Reset Credits</Button>
			</div>
		{/snippet}
	</PageHeader>

	<Card class="mb-6">
		<div class="text-sm text-muted">Current Balance</div>
		<div class="text-3xl font-bold">{formatNumber(user?.creditBalance || 0)}</div>
	</Card>

	<Table headers={['ID', 'Amount', 'Type', 'Description', 'Date']}>
		{#each entries as entry (entry.id)}
			<tr>
				<td class="px-4 py-3 text-sm">{entry.id}</td>
				<td class="px-4 py-3 text-sm font-medium">{formatNumber(entry.amount)}</td>
				<td class="px-4 py-3 text-sm">{entry.type}</td>
				<td class="px-4 py-3 text-sm">{entry.description}</td>
				<td class="px-4 py-3 text-sm">{formatDateTime(entry.createdAt)}</td>
			</tr>
		{/each}
	</Table>

	<Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />

	<Modal bind:open={showResetModal} title="Reset Credits" onclose={() => (showResetModal = false)}>
		<div class="space-y-4">
			<p>Set a new credit balance for <strong>{user?.name}</strong>.</p>
			<input
				type="number"
				bind:value={resetAmount}
				placeholder="Enter amount"
				class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
			/>
		</div>
		{#snippet footer()}
			<Button variant="outline" onclick={() => (showResetModal = false)}>Cancel</Button>
			<Button onclick={handleResetCredits}>Confirm</Button>
		{/snippet}
	</Modal>
{/if}
