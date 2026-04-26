<script lang="ts">
	import { onMount } from 'svelte';
	import { getExchangeRates, fetchLiveRates } from '$lib/api/billing';
	import type { ExchangeRate } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatNumber } from '$lib/utils';

	let rates = $state<ExchangeRate[]>([]);
	let loading = $state(true);
	let refreshing = $state(false);

	async function loadRates() {
		loading = true;
		try {
			const res = await getExchangeRates();
			if (res.success) {
				rates = res.data;
			}
		} catch {
		} finally {
			loading = false;
		}
	}

	async function handleRefresh() {
		refreshing = true;
		try {
			await fetchLiveRates();
			await loadRates();
		} catch {
		} finally {
			refreshing = false;
		}
	}

	onMount(loadRates);
</script>

<PageHeader title="Exchange Rates" description="Current exchange rates">
	{#snippet action()}
		<Button onclick={handleRefresh} loading={refreshing}>Refresh Live Rates</Button>
	{/snippet}
</PageHeader>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table headers={['Currency', 'Rate', 'Symbol']} empty={rates.length === 0}>
		{#each rates as rate}
			<tr class="hover:bg-surface-hover">
				<td class="px-4 py-3">{rate.currency}</td>
				<td class="px-4 py-3">{formatNumber(rate.rate)}</td>
				<td class="px-4 py-3">{rate.symbol || '—'}</td>
			</tr>
		{/each}
	</Table>
{/if}
