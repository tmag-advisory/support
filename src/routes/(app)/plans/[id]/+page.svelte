<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getPlan, flagPlan, archivePlan, deletePlan } from '$lib/api/technical';
  import type { GeneratedPlan } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { formatDateTime, formatNumber } from '$lib/utils';
  import { goto } from '$app/navigation';

  let plan = $state<GeneratedPlan | null>(null);
  let loading = $state(true);
  let showDeleteConfirm = $state(false);

  async function loadPlan() {
    loading = true;
    try {
      const id = Number($page.params.id);
      plan = (await getPlan(id)).data;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadPlan();
  });

  async function handleFlag() {
    if (!plan) return;
    await flagPlan(plan.id);
    await loadPlan();
  }

  async function handleArchive() {
    if (!plan) return;
    await archivePlan(plan.id);
    await loadPlan();
  }

  async function handleDelete() {
    if (!plan) return;
    await deletePlan(plan.id);
    goto('/plans');
  }
</script>

{#if loading}
  <LoadingSpinner />
{:else if plan}
  <PageHeader title="Plan #{plan.id}">
    {#snippet action()}
      <div class="flex gap-2">
        <Button variant="outline" onclick={handleFlag}>Flag</Button>
        <Button variant="outline" onclick={handleArchive}>Archive</Button>
        <Button variant="danger" onclick={() => (showDeleteConfirm = true)}>Delete</Button>
      </div>
    {/snippet}
  </PageHeader>

  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <Card>
      <h3 class="text-lg font-semibold mb-3">Overview</h3>
      <dl class="space-y-3">
        <div>
          <dt class="text-sm font-medium text-muted">Destination</dt>
          <dd class="text-sm text-heading">{plan.destination}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-muted">Duration</dt>
          <dd class="text-sm text-heading">{plan.duration}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-muted">Purpose</dt>
          <dd class="text-sm text-heading">{plan.purpose || '—'}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-muted">Risk Score</dt>
          <dd class="text-sm text-heading">{formatNumber(plan.riskScore ?? 0)}</dd>
        </div>
      </dl>
    </Card>

    <Card>
      <h3 class="text-lg font-semibold mb-3">Status</h3>
      <Badge text={plan.status} />
    </Card>

    <Card>
      <h3 class="text-lg font-semibold mb-3">Health Info</h3>
      <div class="space-y-4">
        {#if plan.vaccinations && plan.vaccinations.length > 0}
          <div>
            <h4 class="text-sm font-medium text-muted">Vaccinations</h4>
            <ul class="mt-1 space-y-1">
              {#each plan.vaccinations as vax}
                <li class="text-sm text-heading">{vax}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if plan.healthAlerts && plan.healthAlerts.length > 0}
          <div>
            <h4 class="text-sm font-medium text-muted">Health Alerts</h4>
            <ul class="mt-1 space-y-1">
              {#each plan.healthAlerts as alert}
                <li class="text-sm text-heading">{alert}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if plan.safetyAdvisories && plan.safetyAdvisories.length > 0}
          <div>
            <h4 class="text-sm font-medium text-muted">Safety Advisories</h4>
            <ul class="mt-1 space-y-1">
              {#each plan.safetyAdvisories as advisory}
                <li class="text-sm text-heading">{advisory}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </Card>

    <Card>
      <h3 class="text-lg font-semibold mb-3">Meta</h3>
      <dl class="space-y-3">
        <div>
          <dt class="text-sm font-medium text-muted">User</dt>
          <dd class="text-sm text-heading">{plan.userEmail || '—'}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-muted">Created</dt>
          <dd class="text-sm text-heading">{formatDateTime(plan.createdAt)}</dd>
        </div>
      </dl>
    </Card>
  </div>

  <ConfirmDialog
    open={showDeleteConfirm}
    title="Delete Plan"
    message="Are you sure you want to delete this plan? This action cannot be undone."
    onconfirm={handleDelete}
    oncancel={() => (showDeleteConfirm = false)}
  />
{/if}
