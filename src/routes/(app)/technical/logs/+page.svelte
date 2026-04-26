<script lang="ts">
  import { onMount } from 'svelte';
  import { getSystemLogs } from '$lib/api/technical';
  import type { SystemLog } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime } from '$lib/utils';

  let logs = $state<SystemLog[]>([]);
  let loading = $state(false);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let levelFilter = $state('');

  async function loadLogs() {
    loading = true;
    try {
      const res = await getSystemLogs({
        level: levelFilter || undefined,
        page: currentPage,
        size: 20
      });
      logs = res.data.content ?? [];
      totalPages = res.data.totalPages ?? 0;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadLogs();
  });

  $effect(() => {
    currentPage;
    levelFilter;
    loadLogs();
  });

  const levelColor = (level: string) => {
    if (level === 'info') return 'info';
    if (level === 'warning') return 'warning';
    if (level === 'error') return 'danger';
    if (level === 'critical') return 'danger';
    return 'default';
  };

  const levelFilters = ['', 'info', 'warning', 'error', 'critical'];
  const headers = ['Time', 'Level', 'Source', 'Message'];
</script>

<PageHeader title="System Logs">
  {#snippet action()}
    <div class="flex items-center gap-2">
      {#each levelFilters as filter}
        <button
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {levelFilter === filter
            ? 'bg-accent text-white'
            : 'bg-surface border border-border text-muted hover:bg-surface-hover'}"
          onclick={() => {
            levelFilter = filter;
            currentPage = 0;
          }}
        >
          {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'All'}
        </button>
      {/each}
    </div>
  {/snippet}
</PageHeader>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table {headers} empty={logs.length === 0}>
    {#each logs as log (log.id)}
      <tr>
        <td class="px-4 py-3 text-sm">{formatDateTime(log.createdAt)}</td>
        <td class="px-4 py-3 text-sm">
          <Badge text={log.level} variant={levelColor(log.level)} />
        </td>
        <td class="px-4 py-3 text-sm">{log.source || '—'}</td>
        <td class="px-4 py-3 text-sm">{(log.message ?? '').length > 80 ? log.message.slice(0, 80) + '…' : log.message}</td>
      </tr>
    {/each}
  </Table>

  <div class="mt-4">
    <Pagination
      {currentPage}
      {totalPages}
      onPageChange={(p) => (currentPage = p)}
    />
  </div>
{/if}
