<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getOnboardingRequests,
		approveOnboarding,
		rejectOnboarding
	} from '$lib/api/company';
	import type { CompanyOnboardingRequest } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime } from '$lib/utils';

	let requests = $state<CompanyOnboardingRequest[]>([]);
	let loading = $state(true);
	let currentPage = $state(0);
	let totalPages = $state(0);
	let statusFilter = $state('');
	let showRejectModal = $state(false);
	let rejectId = $state(0);
	let rejectReason = $state('');

	async function fetchRequests() {
		loading = true;
		try {
			const response = await getOnboardingRequests({
				page: currentPage,
				status: statusFilter || undefined
			});
			requests = response.data.content ?? [];
			totalPages = response.data.totalPages ?? 0;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchRequests();
	});

	$effect(() => {
		currentPage;
		statusFilter;
		fetchRequests();
	});

	async function handleApprove(id: number) {
		await approveOnboarding(id);
		fetchRequests();
	}

	function openRejectModal(id: number) {
		rejectId = id;
		rejectReason = '';
		showRejectModal = true;
	}

	async function handleReject() {
		await rejectOnboarding(rejectId, rejectReason);
		showRejectModal = false;
		rejectId = 0;
		rejectReason = '';
		fetchRequests();
	}

	const headers = ['ID', 'Company', 'Contact', 'Email', 'Plan', 'Status', 'Created', 'Actions'];
</script>

<PageHeader
	title="Company Registrations"
	description="Review company onboarding requests"
/>

<div class="mb-4 flex gap-2">
	<Button
		variant={statusFilter === '' ? 'primary' : 'outline'}
		onclick={() => { statusFilter = ''; currentPage = 0; }}
	>
		All
	</Button>
	<Button
		variant={statusFilter === 'PENDING' ? 'primary' : 'outline'}
		onclick={() => { statusFilter = 'PENDING'; currentPage = 0; }}
	>
		Pending
	</Button>
	<Button
		variant={statusFilter === 'APPROVED' ? 'primary' : 'outline'}
		onclick={() => { statusFilter = 'APPROVED'; currentPage = 0; }}
	>
		Approved
	</Button>
	<Button
		variant={statusFilter === 'REJECTED' ? 'primary' : 'outline'}
		onclick={() => { statusFilter = 'REJECTED'; currentPage = 0; }}
	>
		Rejected
	</Button>
</div>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table {headers}>
		{#each requests as req (req.id)}
			<tr>
				<td class="px-4 py-3">{req.id}</td>
				<td class="px-4 py-3">{req.companyName}</td>
				<td class="px-4 py-3">{req.contactName}</td>
				<td class="px-4 py-3">{req.contactEmail}</td>
				<td class="px-4 py-3">{req.selectedPlan || '—'}</td>
				<td class="px-4 py-3">
					<Badge text={req.status} />
				</td>
				<td class="px-4 py-3">{formatDateTime(req.createdAt)}</td>
				<td class="px-4 py-3">
					{#if req.status === 'PENDING'}
						<div class="flex gap-2">
							<Button size="sm" onclick={() => handleApprove(req.id)}>Approve</Button>
							<Button size="sm" variant="danger" onclick={() => openRejectModal(req.id)}>Reject</Button>
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
	<Modal bind:open={showRejectModal} onclose={() => { showRejectModal = false; rejectId = 0; rejectReason = ''; }}>
		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-semibold">Reject Onboarding Request</h2>
			<textarea
				class="w-full rounded-xl border border-border-light bg-white p-4 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
				rows="4"
				placeholder="Reason for rejection..."
				bind:value={rejectReason}
			></textarea>
			<div class="flex justify-end gap-2">
				<Button variant="outline" onclick={() => { showRejectModal = false; rejectId = 0; rejectReason = ''; }}>
					Cancel
				</Button>
				<Button variant="danger" onclick={handleReject}>
					Reject
				</Button>
			</div>
		</div>
	</Modal>
{/if}
