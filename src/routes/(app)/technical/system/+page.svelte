<script lang="ts">
  import { onMount } from 'svelte';
  import { getSystemStatus, toggleMaintenance } from '$lib/api/technical';
  import type { SystemStatus } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

  let status = $state<SystemStatus | null>(null);
  let loading = $state(false);
  let toggling = $state(false);

  onMount(async () => {
    loading = true;
    try {
      const res = await getSystemStatus();
      if (res.success) {
        status = res.data;
      }
    } finally {
      loading = false;
    }
  });

  async function handleToggleMaintenance() {
    toggling = true;
    try {
      await toggleMaintenance();
      const res = await getSystemStatus();
      if (res.success) {
        status = res.data;
      }
    } finally {
      toggling = false;
    }
  }

  const statusVariant = (s: string) => {
    if (s === 'online' || s === 'healthy') return 'success';
    if (s === 'degraded') return 'warning';
    return 'danger';
  };
</script>

<PageHeader title="System Status" description="Platform health overview">
  {#snippet action()}
    <Button onclick={handleToggleMaintenance} loading={toggling}>
      Toggle Maintenance
    </Button>
  {/snippet}
</PageHeader>

{#if loading}
  <LoadingSpinner />
{:else if status}
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Card>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">Database</span>
        <Badge text={status.database} variant={statusVariant(status.database)} />
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">AI Engine</span>
        <Badge text={status.aiEngine} variant={statusVariant(status.aiEngine)} />
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">Payment Gateway</span>
        <Badge text={status.paymentGateway} variant={statusVariant(status.paymentGateway)} />
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">Email Service</span>
        <Badge text={status.emailService} variant={statusVariant(status.emailService)} />
      </div>
    </Card>

    <Card>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted">Overall</span>
        <Badge text={status.overall} variant={statusVariant(status.overall)} />
      </div>
    </Card>
  </div>
{/if}
