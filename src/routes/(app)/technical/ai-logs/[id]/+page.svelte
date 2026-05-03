<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getAiLog, flagAiLog } from '$lib/api/technical';
  import type { AiLog } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, formatNumber } from '$lib/utils';

  let log = $state<AiLog | null>(null);
  let loading = $state(false);
  let flagging = $state(false);

  onMount(async () => {
    loading = true;
    try {
      const res = await getAiLog(Number($page.params.id));
      if (res.success) {
        log = res.data;
      }
    } finally {
      loading = false;
    }
  });

  async function handleFlag() {
    if (!log) return;
    flagging = true;
    try {
      const res = await flagAiLog(log.id);
      if (res.success) {
        log = res.data;
      }
    } finally {
      flagging = false;
    }
  }
</script>

{#if loading}
  <LoadingSpinner />
{:else if log}
  <PageHeader title="AI Log #{log.id}">
    {#snippet action()}
      <Button variant="outline" onclick={handleFlag} loading={flagging}>
        {log!.flagged ? 'Unflag' : 'Flag'}
      </Button>
    {/snippet}
  </PageHeader>

  <Card>
    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-sm font-medium text-muted">User</dt>
        <dd class="mt-1 text-sm">{log.userEmail || '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Model</dt>
        <dd class="mt-1 text-sm">{log.model || '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Plan Generation Tokens</dt>
        <dd class="mt-1 text-sm">{formatNumber(log.planGenerationTokensUsed || 0)}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Summary Generation Tokens</dt>
        <dd class="mt-1 text-sm">{formatNumber(log.summaryGenerationTokensUsed || 0)}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Total Tokens Used</dt>
        <dd class="mt-1 text-sm">{formatNumber(log.tokensUsed || 0)}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Status</dt>
        <dd class="mt-1">
          <Badge text={log.status} />
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Flagged</dt>
        <dd class="mt-1 text-sm">{log.flagged ? 'Yes' : 'No'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Created</dt>
        <dd class="mt-1 text-sm">{formatDateTime(log.createdAt)}</dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-muted">Prompt Summary</dt>
        <dd class="mt-1 text-sm">{log.promptSummary || '—'}</dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-muted">Response Summary</dt>
        <dd class="mt-1 text-sm">{log.responseSummary || '—'}</dd>
      </div>
    </dl>
  </Card>
{/if}
