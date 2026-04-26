<script lang="ts">
	import { onMount } from 'svelte';
	import { getAbuseFlags, resolveAbuseFlag } from '$lib/api/technical';
	import type { AbuseFlag } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, severityColor } from '$lib/utils';

	let flags = $state<AbuseFlag[]>([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let filter = $state<'' | 'unresolved' | 'resolved'>('');

	async function loadFlags() {
		loading = true;
		try {
			const params: Record<string, string | number> = { page: currentPage };
			if (filter) params.status = filter;
			const res = await getAbuseFlags(params);
		flags = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
		} finally {
			loading = false;
		}
	}

	async function handleResolve(id: number) {
		await resolveAbuseFlag(id);
		await loadFlags();
	}

	onMount(() => {
		loadFlags();
	});

	$effect(() => {
		currentPage;
		filter;
		loadFlags();
	});

	const headers = ['ID', 'User', 'Type', 'Severity', 'Description', 'Status', 'Created', 'Actions'];
</script>

<PageHeader title="Abuse Flags" description="Review and resolve abuse reports" />

<div class="mb-4 flex gap-2">
	<Button variant={filter === '' ? 'primary' : 'secondary'} onclick={() => { filter = ''; currentPage = 0; }}>
		All
	</Button>
	<Button variant={filter === 'unresolved' ? 'primary' : 'secondary'} onclick={() => { filter = 'unresolved'; currentPage = 0; }}>
		Unresolved
	</Button>
	<Button variant={filter === 'resolved' ? 'primary' : 'secondary'} onclick={() => { filter = 'resolved'; currentPage = 0; }}>
		Resolved
	</Button>
</div>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table {headers}>
		{#each flags as flag}
			<tr>
				<td>{flag.id}</td>
				<td>{flag.userEmail || '—'}</td>
				<td>{flag.type}</td>
				<td><Badge text={flag.severity} /></td>
				<td class="max-w-xs truncate">{flag.description}</td>
				<td>
					{#if flag.resolved}
						Resolved
					{:else}
						<Badge text="Active" variant="danger" />
					{/if}
				</td>
				<td>{formatDateTime(flag.createdAt)}</td>
				<td>
					{#if !flag.resolved}
						<Button size="sm" onclick={() => handleResolve(flag.id)}>Resolve</Button>
					{/if}
				</td>
			</tr>
		{/each}
	</Table>

	<Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
{/if}
