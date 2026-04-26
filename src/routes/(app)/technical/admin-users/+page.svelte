<script lang="ts">
    import { onMount } from "svelte";
    import {
        getAdminUsers,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
    } from "$lib/api/technical";
    import type { AdminUser } from "$lib/api/types";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import Table from "$lib/components/ui/Table.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
    import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";

    let adminUsers = $state<AdminUser[]>([]);
    let loading = $state(true);
    let showCreateModal = $state(false);
    let showDeleteConfirm = $state(false);
    let deleteId = $state(0);
    let editUser = $state<Partial<AdminUser> | null>(null);
    let form = $state({
        name: "",
        email: "",
        password: "",
        role: "support_admin",
    });

    async function loadAdminUsers() {
        loading = true;
        try {
            adminUsers = (await getAdminUsers()).data;
        } finally {
            loading = false;
        }
    }

    function openCreate() {
        editUser = null;
        form = { name: "", email: "", password: "", role: "support_admin" };
        showCreateModal = true;
    }

    function openEdit(user: AdminUser) {
        editUser = user;
        form = {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
        };
        showCreateModal = true;
    }

    async function handleSubmit() {
        const payload: Record<string, string> = {
            name: form.name,
            email: form.email,
            role: form.role,
        };
        if (form.password) payload.password = form.password;

        if (editUser?.id) {
            await updateAdminUser(editUser.id, payload);
        } else {
            await createAdminUser(
                payload as unknown as Partial<AdminUser> & { password: string },
            );
        }

        showCreateModal = false;
        await loadAdminUsers();
    }

    function confirmDelete(id: number) {
        deleteId = id;
        showDeleteConfirm = true;
    }

    async function handleDelete() {
        await deleteAdminUser(deleteId);
        showDeleteConfirm = false;
        await loadAdminUsers();
    }

    onMount(() => {
        loadAdminUsers();
    });

    const headers = ["Name", "Email", "Role", "Actions"];
</script>

<PageHeader title="Admin Users">
    {#snippet action()}
        <Button onclick={openCreate}>Create Admin</Button>
    {/snippet}
</PageHeader>

{#if loading}
    <LoadingSpinner />
{:else}
    <Table {headers}>
        {#each adminUsers as user}
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><Badge text={user.role} /></td>
                <td class="flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onclick={() => openEdit(user)}>Edit</Button
                    >
                    <Button
                        size="sm"
                        variant="danger"
                        onclick={() => confirmDelete(user.id)}>Delete</Button
                    >
                </td>
            </tr>
        {/each}
    </Table>
{/if}

<Modal
    bind:open={showCreateModal}
    title={editUser ? "Edit Admin User" : "Create Admin User"}
    onclose={() => (showCreateModal = false)}
>
    <form onsubmit={handleSubmit} class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium mb-1">Name</label
            >
            <input
                id="name"
                type="text"
                bind:value={form.name}
                required
                class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
            />
        </div>
        <div>
            <label for="email" class="block text-sm font-medium mb-1"
                >Email</label
            >
            <input
                id="email"
                type="email"
                bind:value={form.email}
                required
                class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
            />
        </div>
        <div>
            <label for="password" class="block text-sm font-medium mb-1"
                >Password{editUser
                    ? " (leave blank to keep current)"
                    : ""}</label
            >
            <input
                id="password"
                type="password"
                bind:value={form.password}
                required={!editUser}
                class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
            />
        </div>
        <div>
            <label for="role" class="block text-sm font-medium mb-1">Role</label
            >
            <select
                id="role"
                bind:value={form.role}
                class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
            >
                <option value="super_admin">Super Admin</option>
                <option value="client_admin">Client Admin</option>
                <option value="support_admin">Support Admin</option>
            </select>
        </div>
        <div class="flex justify-end gap-2">
            <Button
                variant="secondary"
                onclick={() => (showCreateModal = false)}>Cancel</Button
            >
            <Button type="submit">{editUser ? "Update" : "Create"}</Button>
        </div>
    </form>
</Modal>

<ConfirmDialog
    open={showDeleteConfirm}
    title="Delete Admin User"
    message="Are you sure you want to delete this admin user?"
    confirmLabel="Delete"
    onconfirm={handleDelete}
    oncancel={() => (showDeleteConfirm = false)}
/>
