<script lang="ts">
  import { onMount } from 'svelte';
  import { getContacts } from '$lib/api/technical';
  import type { ContactSubmission } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import { formatDateTime, truncate } from '$lib/utils';

  let contacts = $state<ContactSubmission[]>([]);
  let loading = $state(true);
  let currentPage = $state(0);
  let totalPages = $state(0);

  async function loadContacts() {
    loading = true;
    try {
      const response = await getContacts({ page: currentPage });
      contacts = response.data.content ?? [];
      totalPages = response.data.totalPages ?? 0;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadContacts();
  });

  $effect(() => {
    currentPage;
    loadContacts();
  });
</script>

<PageHeader
  title="Contact Submissions"
  description="View customer contact form submissions"
/>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table headers={['ID', 'Name', 'Email', 'Subject', 'Message', 'Read', 'Created']}>
    {#each contacts as contact}
      <tr>
        <td class="px-4 py-3 text-sm text-heading">{contact.id}</td>
        <td class="px-4 py-3 text-sm text-heading">{contact.name}</td>
        <td class="px-4 py-3 text-sm text-body">{contact.email}</td>
        <td class="px-4 py-3 text-sm text-heading">{contact.subject || '—'}</td>
        <td class="px-4 py-3 text-sm text-body">{truncate(contact.message, 60)}</td>
        <td class="px-4 py-3">
          {#if contact.read}
            <Badge text="Read" variant="success" />
          {:else}
            <Badge text="Unread" variant="default" />
          {/if}
        </td>
        <td class="px-4 py-3 text-sm text-body">{formatDateTime(contact.createdAt)}</td>
      </tr>
    {/each}
  </Table>

  <Pagination {currentPage} {totalPages} onPageChange={(p) => (currentPage = p)} />
{/if}
