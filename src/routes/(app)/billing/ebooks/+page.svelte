<script lang="ts">
	import { onMount } from 'svelte';
	import { getEbookOrders, getEbookStats } from '$lib/api/billing';
	import type { EbookOrder } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, formatCurrency, formatNumber } from '$lib/utils';

	let orders = $state<EbookOrder[]>([]);
	let stats = $state<any>(null);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);

	async function loadOrders() {
		loading = true;
		try {
			const res = await getEbookOrders({ page: currentPage, size: 20 });
			if (res.success) {
		orders = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
			}
		} catch {
		} finally {
			loading = false;
		}
	}

	async function loadStats() {
		try {
			const res = await getEbookStats();
			if (res.success) {
				stats = res.data;
			}
		} catch {
		}
	}

	onMount(() => {
		loadOrders();
		loadStats();
	});
</script>

{#if stats}
	<div class="mb-6 grid gap-4 sm:grid-cols-3">
		<Card>
			<p class="text-sm text-muted">Total Orders</p>
			<p class="mt-1 text-2xl font-semibold text-heading">{formatNumber(stats.totalOrders ?? 0)}</p>
		</Card>
		<Card>
			<p class="text-sm text-muted">Total Revenue</p>
			<p class="mt-1 text-2xl font-semibold text-heading">{formatCurrency(stats.totalRevenue ?? 0)}</p>
		</Card>
		<Card>
			<p class="text-sm text-muted">Unique Ebooks</p>
			<p class="mt-1 text-2xl font-semibold text-heading">{formatNumber(stats.uniqueEbooks ?? 0)}</p>
		</Card>
	</div>
{/if}

<PageHeader title="Ebook Orders" />

{#if loading}
	<LoadingSpinner />
{:else}
	<Table
		headers={['ID', 'Ebook', 'Buyer', 'Region', 'Amount', 'Status', 'Date']}
		empty={orders.length === 0}
	>
		{#each orders as order (order.id)}
			<tr class="hover:bg-surface-hover">
				<td class="px-4 py-3">{order.id}</td>
				<td class="px-4 py-3">{order.ebookTitle}</td>
				<td class="px-4 py-3">{order.userEmail}</td>
				<td class="px-4 py-3">{order.region}</td>
				<td class="px-4 py-3">{formatCurrency(order.amount, order.currency)}</td>
				<td class="px-4 py-3"><Badge text={order.status} /></td>
				<td class="px-4 py-3">{formatDateTime(order.createdAt)}</td>
			</tr>
		{/each}
	</Table>

	<div class="mt-4">
		<Pagination {currentPage} {totalPages} onPageChange={(page) => (currentPage = page)} />
	</div>
{/if}
