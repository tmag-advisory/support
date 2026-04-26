<script lang="ts">
	import { onMount } from 'svelte';
	import { getCreditRequests, approveCreditRequest, rejectCreditRequest } from '$lib/api/company';
	import type { CreditRequest } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	let requests: CreditRequest[] = $state([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let showRejectModal = $state(false);
	let rejectId = $state(0);
	let rejectReason = $state('');

	async function loadRequests() {
		loading = true;
		try {
			const res = await getCreditRequests({ page: currentPage, size: 20 });
			requests = res.data.content ?? [];
			totalPages = res.data.totalPages ?? 0;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadRequests();
	});

	$effect(() => {
		currentPage;
		loadRequests();
	});

	async function handleApprove(id: number) {
		await approveCreditRequest(id);
		await loadRequests();
	}

	function openReject(id: number) {
		rejectId = id;
		rejectReason = '';
		showRejectModal = true;
	}

	async function handleReject() {
		await rejectCreditRequest(rejectId, rejectReason);
		showRejectModal = false;
		await loadRequests();
	}
</script>

<PageHeader title="Global Credit Requests" description="Review and manage credit requests across all companies" />

{#if loading}
	<LoadingSpinner />
{:else}
	<Table headers={['ID', 'Company', 'Employee', 'Amount', 'Reason', 'Status', 'Created', 'Actions']}>
		{#each requests as req}
			<tr>
				<td class="px-4 py-3">{req.id}</td>
				<td class="px-4 py-3 font-medium">{req.companyName || '-'}</td>
				<td class="px-4 py-3 font-medium">{req.userName}</td>
				<td class="px-4 py-3">{req.amount}</td>
				<td class="px-4 py-3 max-w-xs truncate" title={req.reason}>{req.reason}</td>
				<td class="px-4 py-3"><Badge text={req.status} /></td>
				<td class="px-4 py-3">{formatDateTime(req.createdAt)}</td>
				<td class="px-4 py-3">
					{#if req.status === 'PENDING'}
						<div class="flex gap-2">
							<Button size="sm" onclick={() => handleApprove(req.id)}>Approve</Button>
							<Button size="sm" variant="danger" onclick={() => openReject(req.id)}>Reject</Button>
						</div>
					{/if}
				</td>
			</tr>
		{/each}
	</Table>

	{#if totalPages > 1}
		<Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
	{/if}
{/if}

{#if showRejectModal}
	<Modal bind:open={showRejectModal} title="Reject Credit Request" onclose={() => (showRejectModal = false)}>
		<div class="mb-4">
			<label for="rejectReason" class="block text-sm font-medium mb-1">Reason</label>
			<textarea id="rejectReason" bind:value={rejectReason} rows="3" class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"></textarea>
		</div>
		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => (showRejectModal = false)}>Cancel</Button>
			<Button variant="danger" onclick={handleReject}>Reject</Button>
		</div>
	</Modal>
{/if}
