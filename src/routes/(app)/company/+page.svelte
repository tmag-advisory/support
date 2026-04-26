<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getCompanies } from "$lib/api/company";
    import type { Company } from "$lib/api/types";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import Table from "$lib/components/ui/Table.svelte";
    import Pagination from "$lib/components/ui/Pagination.svelte";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";
    import { formatNumber, formatDateTime } from "$lib/utils";

    let companies: Company[] = $state([]);
    let loading = $state(true);
    let currentPage = $state(0);
    let totalPages = $state(0);
    let search = $state("");

    async function loadCompanies() {
        loading = true;
        try {
            const res = await getCompanies({
                search: search || undefined,
                page: currentPage,
                size: 20,
            });
            if (res.success) {
                companies = res.data.content ?? [];
                totalPages = res.data.totalPages ?? 0;
            }
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadCompanies();
    });

    $effect(() => {
        currentPage;
        loadCompanies();
    });
</script>

<PageHeader title="Companies" description="Manage company accounts">
    {#snippet action()}
        <SearchInput
            value={search}
            placeholder="Search companies..."
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
            "Company",
            "Industry",
            "Credits",
            "Tier",
            "Status",
            "Employees",
            "Created",
        ]}
    >
        {#each companies as company}
            <tr
                class="hover:bg-gray-50 cursor-pointer"
                onclick={() => goto(`/company/${company.id}`)}
            >
                <td class="px-4 py-3 font-medium">{company.name}</td>
                <td class="px-4 py-3">{company.industry || "—"}</td>
                <td class="px-4 py-3"
                    >{formatNumber(company.creditsRemaining || 0)}</td
                >
                <td class="px-4 py-3">{company.tier ?? "—"}</td>
                <td class="px-4 py-3"
                    ><Badge text={company.billingStatus ?? ""} /></td
                >
                <td class="px-4 py-3">{company.activeEmployees || 0}</td>
                <td class="px-4 py-3">{formatDateTime(company.createdAt)}</td>
            </tr>
        {/each}
    </Table>

    <Pagination
        {currentPage}
        {totalPages}
        onPageChange={(p) => (currentPage = p)}
    />
{/if}
