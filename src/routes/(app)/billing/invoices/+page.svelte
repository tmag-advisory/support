<script lang="ts">
  import { onMount } from 'svelte';
  import { getInvoices } from '$lib/api/billing';
  import type { Invoice } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, formatCurrency } from '$lib/utils';

  let invoices = $state<Invoice[]>([]);
  let loading = $state(false);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let statusFilter = $state('');

  async function loadInvoices() {
    loading = true;
    try {
      const res = await getInvoices({
        status: statusFilter || undefined,
        page: currentPage,
        size: 20
      });
      if (res.success) {
		invoices = res.data.content ?? [];
		totalPages = res.data.totalPages ?? 0;
      }
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadInvoices();
  });

  $effect(() => {
    currentPage;
    loadInvoices();
  });

  const statusFilters = ['', 'paid', 'pending', 'overdue', 'refunded'];
  const headers = ['#', 'Invoice', 'Company', 'Amount', 'Status', 'Due Date', 'Paid At', 'Created'];
</script>

<PageHeader title="Invoices" description="Manage platform invoices">
  {#snippet action()}
    <div class="flex items-center gap-2">
      {#each statusFilters as filter}
        <Button
          variant={statusFilter === filter ? 'primary' : 'outline'}
          size="sm"
          onclick={() => {
            statusFilter = filter;
            currentPage = 0;
            loadInvoices();
          }}
        >
          {filter || 'All'}
        </Button>
      {/each}
    </div>
  {/snippet}
</PageHeader>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table {headers} empty={invoices.length === 0}>
    {#each invoices as entry, i (entry.id)}
      <tr class="cursor-pointer hover:bg-surface-hover transition-colors">
        <td class="px-4 py-3 text-sm">{currentPage * 20 + i + 1}</td>
        <td class="px-4 py-3 text-sm">
          <a href="/billing/invoices/{entry.id}" class="text-accent hover:underline">
            {entry.invoiceNumber || '—'}
          </a>
        </td>
        <td class="px-4 py-3 text-sm">{entry.companyName || '—'}</td>
        <td class="px-4 py-3 text-sm">{formatCurrency(entry.amount, entry.currency)}</td>
        <td class="px-4 py-3 text-sm">
          <Badge text={entry.status} />
        </td>
        <td class="px-4 py-3 text-sm">{formatDateTime(entry.dueDate)}</td>
        <td class="px-4 py-3 text-sm">{formatDateTime(entry.paidAt)}</td>
        <td class="px-4 py-3 text-sm">{formatDateTime(entry.createdAt)}</td>
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
