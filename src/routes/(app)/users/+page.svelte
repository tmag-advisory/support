<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getUsers } from "$lib/api/technical";
    import type { User } from "$lib/api/types";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import Table from "$lib/components/ui/Table.svelte";
    import Pagination from "$lib/components/ui/Pagination.svelte";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
    import { formatNumber, formatDateTime } from "$lib/utils";

    let users: User[] = $state([]);
    let loading = $state(true);
    let currentPage = $state(0);
    let totalPages = $state(0);
    let search = $state("");

    async function loadUsers() {
        loading = true;
        try {
            const res = await getUsers({
                search: search || undefined,
                page: currentPage,
                size: 20,
            });
            if (res.success) {
                users = res.data.content ?? [];
                totalPages = res.data.totalPages ?? 0;
            }
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadUsers();
    });

    $effect(() => {
        currentPage;
        loadUsers();
    });
</script>

<PageHeader title="Users" description="Search and manage user accounts">
    {#snippet action()}
        <SearchInput
            value={search}
            placeholder="Search users..."
            onInput={() => {
                currentPage = 0;
            }}
        />
    {/snippet}
</PageHeader>

{#if loading}
    <LoadingSpinner />
{:else}
    <Table
        headers={[
            "ID",
            "Name",
            "Email",
            "Credits",
            "Status",
            "Onboarded",
            "Created",
        ]}
    >
        {#each users as user (user.id)}
            <tr
                class="hover:bg-muted/50 cursor-pointer"
                onclick={() => goto(`/users/${user.id}`)}
            >
                <td class="px-4 py-3 text-sm">{user.id}</td>
                <td class="px-4 py-3 text-sm font-medium">{user.name}</td>
                <td class="px-4 py-3 text-sm">{user.email}</td>
                <td class="px-4 py-3 text-sm"
                    >{formatNumber(user.creditBalance || 0)}</td
                >
                <td class="px-4 py-3 text-sm"
                    ><Badge text={user.status ?? ""} /></td
                >
                <td class="px-4 py-3 text-sm"
                    >{user.onboarded ? "Yes" : "No"}</td
                >
                <td class="px-4 py-3 text-sm"
                    >{formatDateTime(user.createdAt)}</td
                >
            </tr>
        {/each}
    </Table>

    <Pagination
        {currentPage}
        {totalPages}
        onPageChange={(p) => (currentPage = p)}
    />
{/if}
