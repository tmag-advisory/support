<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getInvoice, markInvoicePaid, getInvoicePdfUrl } from '$lib/api/billing';
  import type { Invoice } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, formatCurrency } from '$lib/utils';

  let invoice = $state<Invoice | null>(null);
  let loading = $state(true);
  let markingPaid = $state(false);

  onMount(async () => {
    try {
      const res = await getInvoice(Number($page.params.id));
      if (res.success) {
        invoice = res.data;
      }
    } finally {
      loading = false;
    }
  });

  async function handleMarkPaid() {
    if (!invoice) return;
    markingPaid = true;
    try {
      const res = await markInvoicePaid(invoice.id);
      if (res.success) {
        invoice = res.data;
      }
    } finally {
      markingPaid = false;
    }
  }

  async function handleViewPdf() {
    if (!invoice) return;
    window.open(await getInvoicePdfUrl(invoice.id), '_blank');
  }
</script>

{#if loading}
  <LoadingSpinner />
{:else if invoice}
  <PageHeader title="Invoice #{invoice.invoiceNumber || invoice.id}">
    {#snippet action()}
      <Button variant="outline" onclick={handleViewPdf}>View PDF</Button>
      {#if invoice && invoice.status !== 'paid'}
        <Button onclick={handleMarkPaid} loading={markingPaid}>Mark Paid</Button>
      {/if}
    {/snippet}
  </PageHeader>

  <Card>
    <dl class="grid gap-4 sm:grid-cols-2">
      <div>
        <dt class="text-sm font-medium text-muted">Invoice Number</dt>
        <dd class="mt-1 text-sm">{invoice.invoiceNumber || '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Company</dt>
        <dd class="mt-1 text-sm">{invoice.companyName || '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Amount</dt>
        <dd class="mt-1 text-sm">{formatCurrency(invoice.amount, invoice.currency)}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Status</dt>
        <dd class="mt-1">
          <Badge text={invoice.status} />
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Due Date</dt>
        <dd class="mt-1 text-sm">{formatDateTime(invoice.dueDate)}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Paid At</dt>
        <dd class="mt-1 text-sm">{formatDateTime(invoice.paidAt)}</dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-muted">Description</dt>
        <dd class="mt-1 text-sm">{invoice.description || '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Created</dt>
        <dd class="mt-1 text-sm">{formatDateTime(invoice.createdAt)}</dd>
      </div>
    </dl>
  </Card>
{/if}
