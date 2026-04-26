<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCompany, getCompanyPlans } from '$lib/api/company';
	import type { GeneratedPlan } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	let plans: GeneratedPlan[] = $state([]);
	let companyName = $state('');
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);

	async function loadPlans() {
		loading = true;
		try {
			const res = await getCompanyPlans({ page: currentPage, size: 20 });
		plans = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		const company = (await getCompany(Number($page.params.id))).data;
		companyName = company.name;
		await loadPlans();
	});

	$effect(() => {
		currentPage;
		loadPlans();
	});
</script>

<PageHeader title="Plans - {companyName}" />

{#if loading}
	<LoadingSpinner />
{:else}
	<Table headers={['ID', 'Destination', 'Duration', 'Risk Score', 'Status', 'Created']}>
		{#each plans as plan}
			<tr>
				<td class="px-4 py-3">{plan.id}</td>
				<td class="px-4 py-3 font-medium">{plan.destination}</td>
				<td class="px-4 py-3">{plan.duration}</td>
				<td class="px-4 py-3">{plan.riskScore}</td>
				<td class="px-4 py-3"><Badge text={plan.status} /></td>
				<td class="px-4 py-3">{formatDateTime(plan.createdAt)}</td>
			</tr>
		{/each}
	</Table>

	<Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
{/if}
