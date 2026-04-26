<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getPlans, getUser } from '$lib/api/technical';
	import type { GeneratedPlan, User } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	let user: User | null = $state(null);
	let plans: GeneratedPlan[] = $state([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);

	async function loadData() {
		loading = true;
		try {
			const userId = Number($page.params.id);
			const [u, p] = await Promise.all([
				getUser(userId),
				getPlans({ userId, page: currentPage, size: 20 })
			]);
			if (u.success) user = u.data;
			if (p.success) {
				plans = p.data.content ?? [];
				totalPages = p.data.totalPages ?? 0;
			}
		} finally {
			loading = false;
		}
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
	<PageHeader title="Plans - {user?.name ?? ''}" description="View generated travel plans">
		{#snippet action()}
			<a href="/users/{$page.params.id}" class="text-sm text-muted hover:underline">
				&larr; Back to user
			</a>
		{/snippet}
	</PageHeader>

	<Table headers={['ID', 'Destination', 'Duration', 'Risk Score', 'Status', 'Created']}>
		{#each plans as plan (plan.id)}
			<tr>
				<td class="px-4 py-3 text-sm">{plan.id}</td>
				<td class="px-4 py-3 text-sm font-medium">{plan.destination}</td>
				<td class="px-4 py-3 text-sm">{plan.duration} days</td>
				<td class="px-4 py-3 text-sm">{plan.riskScore}</td>
				<td class="px-4 py-3 text-sm"><Badge text={plan.status} /></td>
				<td class="px-4 py-3 text-sm">{formatDateTime(plan.createdAt)}</td>
			</tr>
		{/each}
	</Table>

	<Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
{/if}
