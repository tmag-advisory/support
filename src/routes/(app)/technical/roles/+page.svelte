<script lang="ts">
	import { onMount } from 'svelte';
	import { getRoles, createRole, updateRole, deleteRole } from '$lib/api/technical';
	import type { Role } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';

	let roles = $state<Role[]>([]);
	let loading = $state(true);
	let showCreateModal = $state(false);
	let showDeleteConfirm = $state(false);
	let deleteId = $state(0);
	let editRole = $state<Partial<Role> | null>(null);
	let form = $state({ name: '', description: '', permissions: '' });

	async function loadRoles() {
		loading = true;
		try {
			roles = (await getRoles()).data ?? [];
		} finally {
			loading = false;
		}
	}

	function openCreate() {
		editRole = null;
		form = { name: '', description: '', permissions: '' };
		showCreateModal = true;
	}

	function openEdit(role: Role) {
		editRole = role;
		form = {
			name: role.name,
			description: role.description || '',
			permissions: role.permissions.join(', ')
		};
		showCreateModal = true;
	}

	async function handleSubmit() {
		const permissions = form.permissions.split(',').map((p) => p.trim()).filter(Boolean);
		const payload = { name: form.name, description: form.description, permissions };

		if (editRole?.id) {
			await updateRole(editRole.id, payload);
		} else {
			await createRole(payload);
		}

		showCreateModal = false;
		await loadRoles();
	}

	function confirmDelete(id: number) {
		deleteId = id;
		showDeleteConfirm = true;
	}

	async function handleDelete() {
		await deleteRole(deleteId);
		showDeleteConfirm = false;
		await loadRoles();
	}

	onMount(() => {
		loadRoles();
	});

	const headers = ['Name', 'Description', 'Permissions', 'Actions'];
</script>

<PageHeader title="Roles">
	{#snippet action()}
		<Button onclick={openCreate}>Create Role</Button>
	{/snippet}
</PageHeader>

{#if loading}
	<LoadingSpinner />
{:else}
	<Table {headers}>
		{#each roles as role}
			<tr>
				<td>{role.name}</td>
				<td>{role.description || '—'}</td>
				<td>{role.permissions.length} permissions</td>
				<td class="flex gap-2">
					<Button size="sm" variant="secondary" onclick={() => openEdit(role)}>Edit</Button>
					<Button size="sm" variant="danger" onclick={() => confirmDelete(role.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</Table>
{/if}

<Modal bind:open={showCreateModal} title={editRole ? 'Edit Role' : 'Create Role'} onclose={() => (showCreateModal = false)}>
	<form onsubmit={handleSubmit} class="space-y-4">
		<div>
			<label for="name" class="block text-sm font-medium mb-1">Name</label>
			<input id="name" type="text" bind:value={form.name} required class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="description" class="block text-sm font-medium mb-1">Description</label>
			<input id="description" type="text" bind:value={form.description} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="permissions" class="block text-sm font-medium mb-1">Permissions (comma-separated)</label>
			<textarea id="permissions" bind:value={form.permissions} rows="3" class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"></textarea>
		</div>
		<div class="flex justify-end gap-2">
			<Button variant="secondary" onclick={() => (showCreateModal = false)}>Cancel</Button>
			<Button type="submit">{editRole ? 'Update' : 'Create'}</Button>
		</div>
	</form>
</Modal>

<ConfirmDialog
	open={showDeleteConfirm}
	title="Delete Role"
	message="Are you sure you want to delete this role?"
	confirmLabel="Delete"
	onconfirm={handleDelete}
	oncancel={() => (showDeleteConfirm = false)}
/>
