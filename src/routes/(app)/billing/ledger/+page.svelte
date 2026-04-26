<script lang="ts">
	import { onMount } from 'svelte';
	import { getCreditLedger } from '$lib/api/billing';
	import type { CreditEntry } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, formatNumber } from '$lib/utils';

	let entries = $state<CreditEntry[]>([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);

	async function loadEntries() {
		loading = true;
		try {
			const res = await getCreditLedger({ page: currentPage, size: 20 });
			if (res.success) {
		entries = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
			}
		} catch {
		} finally {
			loading = false;
		}
	}

	onMount(loadEntries);

	$effect(() => {
		currentPage;
		if (currentPage >= 0) {
			loadEntries();
		}
	});
</script>

<PageHeader title="Credit Ledger" description="Complete credit transaction history" />

{#if loading}
	<LoadingSpinner />
{:else}
	<Table
		headers={['ID', 'User', 'Company', 'Amount', 'Type', 'Balance', 'Date']}
		empty={entries.length === 0}
	>
		{#each entries as entry (entry.id)}
			<tr class="hover:bg-surface-hover">
				<td class="px-4 py-3">{entry.id}</td>
				<td class="px-4 py-3">{entry.userEmail || '—'}</td>
				<td class="px-4 py-3">{entry.companyName || '—'}</td>
				<td class="px-4 py-3">{formatNumber(entry.amount)}</td>
				<td class="px-4 py-3">{entry.type}</td>
				<td class="px-4 py-3">{formatNumber(entry.balance || 0)}</td>
				<td class="px-4 py-3">{formatDateTime(entry.createdAt)}</td>
			</tr>
		{/each}
	</Table>

	<div class="mt-4">
		<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />
	</div>
{/if}
