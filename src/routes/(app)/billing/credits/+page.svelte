<script lang="ts">
  import { onMount } from 'svelte';
  import { getCreditLedger, adjustCredits } from '$lib/api/billing';
  import type { CreditEntry } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import SearchInput from '$lib/components/ui/SearchInput.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, formatNumber } from '$lib/utils';

  let entries = $state<CreditEntry[]>([]);
  let loading = $state(false);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let search = $state('');
  let showAdjustModal = $state(false);
  let adjustForm = $state({ userId: '', companyId: '', amount: '', reason: '' });
  let adjusting = $state(false);

  async function loadEntries() {
    loading = true;
    try {
      const res = await getCreditLedger({ page: currentPage, size: 20 });
      if (res.success) {
		entries = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
      }
    } finally {
      loading = false;
    }
  }

  async function handleSubmitAdjust() {
    adjusting = true;
    try {
      await adjustCredits({
        userId: Number(adjustForm.userId),
        companyId: Number(adjustForm.companyId),
        amount: Number(adjustForm.amount),
        reason: adjustForm.reason,
      });
      showAdjustModal = false;
      adjustForm = { userId: '', companyId: '', amount: '', reason: '' };
      await loadEntries();
    } finally {
      adjusting = false;
    }
  }

  onMount(() => {
    loadEntries();
  });

  $effect(() => {
    currentPage;
    loadEntries();
  });

  const headers = ['ID', 'User', 'Company', 'Amount', 'Type', 'Description', 'Date'];
</script>

<PageHeader title="Credit Ledger">
  {#snippet action()}
    <SearchInput value={search} placeholder="Search credits..." onInput={(v) => search = v} />
    <Button onclick={() => (showAdjustModal = true)}>Adjust Credits</Button>
  {/snippet}
</PageHeader>

{#if loading}
  <div class="flex justify-center py-12">
    <LoadingSpinner />
  </div>
{:else}
  <Table {headers}>
    {#each entries as entry (entry.id)}
      <tr>
        <td class="px-4 py-3 text-sm">{entry.id}</td>
        <td class="px-4 py-3 text-sm">{entry.userEmail || '—'}</td>
        <td class="px-4 py-3 text-sm">{entry.companyName || '—'}</td>
        <td class="px-4 py-3 text-sm">
          {entry.amount >= 0 ? '+' : ''}{formatNumber(entry.amount)}
        </td>
        <td class="px-4 py-3 text-sm">{entry.type}</td>
        <td class="px-4 py-3 text-sm">
          {(entry.description ?? '—').length > 40 ? (entry.description ?? '—').slice(0, 40) + '...' : (entry.description ?? '—')}
        </td>
        <td class="px-4 py-3 text-sm">{formatDateTime(entry.createdAt)}</td>
      </tr>
    {/each}
  </Table>

  <div class="mt-4">
    <Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
  </div>
{/if}

<Modal open={showAdjustModal} title="Adjust Credits" onclose={() => (showAdjustModal = false)}>
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSubmitAdjust(); }}>
    <div>
      <label for="userId" class="mb-1 block text-sm font-medium">User ID</label>
      <input
        id="userId"
        type="number"
        bind:value={adjustForm.userId}
        required
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
      />
    </div>
    <div>
      <label for="companyId" class="mb-1 block text-sm font-medium">Company ID</label>
      <input
        id="companyId"
        type="number"
        bind:value={adjustForm.companyId}
        required
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
      />
    </div>
    <div>
      <label for="amount" class="mb-1 block text-sm font-medium">Amount</label>
      <input
        id="amount"
        type="number"
        bind:value={adjustForm.amount}
        required
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
      />
    </div>
    <div>
      <label for="reason" class="mb-1 block text-sm font-medium">Reason</label>
      <textarea
        id="reason"
        bind:value={adjustForm.reason}
        required
        rows="3"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
      ></textarea>
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="secondary" onclick={() => (showAdjustModal = false)}>Cancel</Button>
      <Button type="submit" loading={adjusting}>Submit</Button>
    </div>
  </form>
</Modal>
