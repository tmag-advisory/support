<script lang="ts">
  import { onMount } from 'svelte';
  import { getAiLogs, flagAiLog } from '$lib/api/technical';
  import type { AiLog } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, formatNumber } from '$lib/utils';

  let logs = $state<AiLog[]>([]);
  let loading = $state(false);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let filter = $state<'' | 'failures' | 'flagged' | 'high-usage'>('');

  async function loadLogs() {
    loading = true;
    try {
      const params: Record<string, unknown> = { page: currentPage, size: 20 };
      if (filter === 'failures') params.status = 'error';
      if (filter === 'flagged') params.flagged = true;
      const res = await getAiLogs(params);
      let content = res.data.content ?? [];
      if (filter === 'high-usage') {
        content = content.filter((l) => (l.tokensUsed || 0) > 3000);
      }
      logs = content;
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
    filter;
    loadLogs();
  });

  async function handleFlag(id: number) {
    await flagAiLog(id);
    await loadLogs();
  }

  const filters = [
    { value: '' as const, label: 'All' },
    { value: 'failures' as const, label: 'Failures' },
    { value: 'flagged' as const, label: 'Flagged' },
    { value: 'high-usage' as const, label: 'High Usage' }
  ];
  const headers = ['ID', 'User', 'Model', 'Plan Tokens', 'Summary Tokens', 'Total Tokens', 'Status', 'Flagged', 'Date'];
</script>

<PageHeader title="AI Logs" description="Monitor AI request activity">
  {#snippet action()}
    <div class="flex items-center gap-2">
      {#each filters as f}
        <button
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {filter === f.value
            ? 'bg-accent text-white'
            : 'bg-surface border border-border text-muted hover:bg-surface-hover'}"
          onclick={() => {
            filter = f.value;
            currentPage = 0;
          }}
        >
          {f.label}
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
        <td class="px-4 py-3 text-sm">
          <a href="/technical/ai-logs/{log.id}" class="text-accent hover:underline">
            {log.id}
          </a>
        </td>
        <td class="px-4 py-3 text-sm">{log.userEmail || '—'}</td>
        <td class="px-4 py-3 text-sm">{log.model || '—'}</td>
        <td class="px-4 py-3 text-sm">{formatNumber(log.planGenerationTokensUsed || 0)}</td>
        <td class="px-4 py-3 text-sm">{formatNumber(log.summaryGenerationTokensUsed || 0)}</td>
        <td class="px-4 py-3 text-sm">{formatNumber(log.tokensUsed || 0)}</td>
        <td class="px-4 py-3 text-sm">
          <Badge text={log.status} />
        </td>
        <td class="px-4 py-3 text-sm">{log.flagged ? 'Yes' : '—'}</td>
        <td class="px-4 py-3 text-sm">{formatDateTime(log.createdAt)}</td>
        <td class="px-4 py-3 text-sm">
          {#if !log.flagged}
            <Button size="sm" variant="outline" onclick={() => handleFlag(log.id)}>
              Flag
            </Button>
          {/if}
        </td>
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
