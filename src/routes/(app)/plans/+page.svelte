<script lang="ts">
  import { onMount } from 'svelte';
  import { getPlans } from '$lib/api/technical';
  import type { GeneratedPlan } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import SearchInput from '$lib/components/ui/SearchInput.svelte';
  import { formatDateTime } from '$lib/utils';

  let plans = $state<GeneratedPlan[]>([]);
  let loading = $state(true);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let statusFilter = $state('');
  let search = $state('');

  async function loadPlans() {
    loading = true;
    try {
      const response = await getPlans({ page: currentPage, status: statusFilter || undefined });
      plans = response.data.content ?? [];
      totalPages = response.data.totalPages ?? 0;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadPlans();
  });

  $effect(() => {
    currentPage;
    statusFilter;
    loadPlans();
  });

  function handleSearch(value: string) {
    search = value;
    currentPage = 0;
    loadPlans();
  }

  const statuses = ['', 'active', 'flagged', 'archived', 'processing'];
  const statusLabels = ['All', 'Active', 'Flagged', 'Archived', 'Processing'];
</script>

<PageHeader
  title="Travel Plans"
  description="Review all generated travel plans"
>
  {#snippet action()}
    <SearchInput value={search} placeholder="Search plans..." onInput={handleSearch} />
  {/snippet}
</PageHeader>

<div class="mb-4 flex gap-2">
  {#each statuses as status, i}
    <button
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {statusFilter === status ? 'bg-accent text-white' : 'bg-button-secondary border border-border-light text-body hover:bg-border-light/50'}"
      onclick={() => { statusFilter = status; currentPage = 0; }}
    >
      {statusLabels[i]}
    </button>
  {/each}
</div>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table headers={['ID', 'User', 'Destination', 'Duration', 'Risk Score', 'Status', 'Created']}>
    {#each plans as plan}
      <tr class="cursor-pointer hover:bg-button-secondary" onclick={() => window.location.href = `/plans/${plan.id}`}>
        <td class="px-4 py-3 text-sm text-heading">{plan.id}</td>
        <td class="px-4 py-3 text-sm text-body">{plan.userEmail || '—'}</td>
        <td class="px-4 py-3 text-sm text-heading">{plan.destination}</td>
        <td class="px-4 py-3 text-sm text-body">{plan.duration}</td>
        <td class="px-4 py-3 text-sm text-heading">{plan.riskScore}</td>
        <td class="px-4 py-3"><Badge text={plan.status} /></td>
        <td class="px-4 py-3 text-sm text-body">{formatDateTime(plan.createdAt)}</td>
      </tr>
    {/each}
  </Table>

  <Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
{/if}
