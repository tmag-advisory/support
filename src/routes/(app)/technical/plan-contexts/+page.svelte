<script lang="ts">
	import { onMount } from 'svelte';
	import { getPlanContexts, uploadPlanContext, togglePlanContextActive, deletePlanContext } from '$lib/api/technical';
	import type { PlanContext } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { formatDateTime } from '$lib/utils';

	let contexts = $state<PlanContext[]>([]);
	let loading = $state(true);
	let showUploadModal = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteId = $state(0);
	let uploadFile = $state<File | null>(null);
	let uploadName = $state('');
	let uploadDesc = $state('');
	let uploading = $state(false);

	async function loadContexts() {
		loading = true;
		try {
			contexts = (await getPlanContexts()).data;
		} finally {
			loading = false;
		}
	}

	async function handleUpload() {
		if (!uploadFile) return;
		uploading = true;
		try {
			const formData = new FormData();
			formData.append('file', uploadFile);
			formData.append('name', uploadName);
			formData.append('description', uploadDesc);
			await uploadPlanContext(formData);
			showUploadModal = false;
			uploadFile = null;
			uploadName = '';
			uploadDesc = '';
			await loadContexts();
		} finally {
			uploading = false;
		}
	}

	async function handleToggle(id: number) {
		await togglePlanContextActive(id);
		await loadContexts();
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		await deletePlanContext(deleteId);
		showDeleteConfirm = false;
		await loadContexts();
	}

	onMount(() => {
		loadContexts();
	});

	const headers = ['Name', 'Description', 'Active', 'Created', 'Actions'];
</script>

<PageHeader title="Plan Contexts" description="Manage AI plan generation context files">
	{#snippet action()}
		<Button onclick={() => (showUploadModal = true)}>Upload Context</Button>
	{/snippet}
</PageHeader>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table {headers}>
		{#each contexts as ctx}
			<tr>
				<td>{ctx.name}</td>
				<td class="max-w-xs truncate">{ctx.description}</td>
				<td><Badge text={ctx.active ? 'Active' : 'Inactive'} /></td>
				<td>{formatDateTime(ctx.createdAt)}</td>
				<td class="flex gap-2">
					<Button size="sm" variant="secondary" onclick={() => handleToggle(ctx.id)}>
						Toggle Active
					</Button>
					<Button size="sm" variant="danger" onclick={() => confirmDelete(ctx.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</Table>
{/if}

<Modal bind:open={showUploadModal} title="Upload Plan Context" onclose={() => (showUploadModal = false)}>
	<form onsubmit={handleUpload} class="space-y-4">
		<div>
			<label for="name" class="block text-sm font-medium mb-1">Name</label>
			<input id="name" type="text" bind:value={uploadName} required class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="description" class="block text-sm font-medium mb-1">Description</label>
			<input id="description" type="text" bind:value={uploadDesc} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="file" class="block text-sm font-medium mb-1">File</label>
			<input
				id="file"
				type="file"
				required
				onchange={(e) => (uploadFile = (e.target as HTMLInputElement).files?.[0] ?? null)}
				class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
			/>
		</div>
		<div class="flex justify-end gap-2">
			<Button variant="secondary" onclick={() => (showUploadModal = false)}>Cancel</Button>
			<Button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
		</div>
	</form>
</Modal>

<ConfirmDialog
	open={showDeleteConfirm}
	title="Delete Plan Context"
	message="Are you sure you want to delete this plan context?"
	confirmLabel="Delete"
	onconfirm={handleDelete}
	oncancel={() => (showDeleteConfirm = false)}
/>
