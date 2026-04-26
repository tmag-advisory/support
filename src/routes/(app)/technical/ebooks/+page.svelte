<script lang="ts">
	import { onMount } from 'svelte';
	import { getEbooks, deleteEbook } from '$lib/api/technical';
	import type { Ebook } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { formatDateTime } from '$lib/utils';

	let ebooks = $state<Ebook[]>([]);
	let loading = $state(true);
	let showDeleteConfirm = $state(false);
	let deleteId = $state(0);

	async function loadEbooks() {
		loading = true;
		try {
			ebooks = (await getEbooks()).data;
		} finally {
			loading = false;
		}
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		await deleteEbook(deleteId);
		showDeleteConfirm = false;
		await loadEbooks();
	}

	onMount(() => {
		loadEbooks();
	});

	const headers = ['Title', 'Author', 'ISBN', 'Pages', 'Status', 'Featured', 'Created', 'Actions'];
</script>

<PageHeader title="Ebooks">
	{#snippet action()}
		<Button><a href="/technical/ebooks/create">Create Ebook</a></Button>
	{/snippet}
</PageHeader>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table {headers}>
		{#each ebooks as ebook}
			<tr>
				<td>{ebook.title}</td>
				<td>{ebook.author || '—'}</td>
				<td>{ebook.isbn || '—'}</td>
				<td>{ebook.pageCount || '—'}</td>
				<td><Badge text={ebook.active ? 'Active' : 'Inactive'} /></td>
				<td>{ebook.featured ? 'Yes' : '—'}</td>
				<td>{formatDateTime(ebook.createdAt)}</td>
				<td class="flex gap-2">
					<a href="/technical/ebooks/{ebook.id}">
						<Button size="sm" variant="secondary">Edit</Button>
					</a>
					<Button size="sm" variant="danger" onclick={() => confirmDelete(ebook.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</Table>
{/if}

<ConfirmDialog
	open={showDeleteConfirm}
	title="Delete Ebook"
	message="Are you sure you want to delete this ebook?"
	confirmLabel="Delete"
	onconfirm={handleDelete}
	oncancel={() => (showDeleteConfirm = false)}
/>
