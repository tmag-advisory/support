<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCompany, getCompanyEmployees } from '$lib/api/company';
	import type { Employee } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	let employees: Employee[] = $state([]);
	let companyName = $state('');
	let loading = $state(true);

	onMount(async () => {
		const id = Number($page.params.id);
		try {
			const [company, empRes] = await Promise.all([getCompany(id), getCompanyEmployees(id)]);
			companyName = company.data.name;
			employees = empRes.data ?? [];
		} finally {
			loading = false;
		}
	});
</script>

<PageHeader title="Team - {companyName}">
	{#snippet action()}
		<a href="/company/{$page.params.id}" class="text-accent hover:underline text-sm">← Back to Company</a>
	{/snippet}
</PageHeader>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table headers={['Name', 'Email', 'Role', 'Status', 'Credits', 'Onboarded', 'Created']}>
		{#each employees as emp}
			<tr>
				<td class="px-4 py-3 font-medium">{emp.name}</td>
				<td class="px-4 py-3">{emp.email}</td>
				<td class="px-4 py-3">{emp.role || '—'}</td>
				<td class="px-4 py-3"><Badge text={emp.status ?? 'Unknown'} /></td>
				<td class="px-4 py-3">{emp.credits || 0}</td>
				<td class="px-4 py-3">{emp.onboarded ? 'Yes' : 'No'}</td>
				<td class="px-4 py-3">{formatDateTime(emp.createdAt)}</td>
			</tr>
		{/each}
	</Table>
{/if}
