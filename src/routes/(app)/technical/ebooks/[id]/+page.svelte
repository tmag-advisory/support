<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import {
    getEbook,
    updateEbook,
    addEbookVersion,
    updateEbookVersion,
    deleteEbookVersion,
    uploadEbookPdf
  } from '$lib/api/technical';
  import type { Ebook, EbookVersion } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { formatDateTime, formatCurrency } from '$lib/utils';

  let ebook: Ebook | null = $state(null);
  let loading = $state(true);
  let showEditModal = $state(false);
  let showVersionModal = $state(false);
  let editForm = $state({
    title: '',
    author: '',
    description: '',
    isbn: '',
    pageCount: '',
    featured: false,
    active: false
  });
  let versionForm = $state({ region: '', price: '', currency: 'USD' });
  let showDeleteConfirm = $state(false);
  let deleteVersionId = $state(0);

  onMount(async () => {
    const id = Number($page.params.id);
    try {
      ebook = (await getEbook(id)).data;
    } finally {
      loading = false;
    }
  });

  function openEditModal() {
    if (!ebook) return;
    editForm = {
      title: ebook.title ?? '',
      author: ebook.author ?? '',
      description: ebook.description ?? '',
      isbn: ebook.isbn ?? '',
      pageCount: String(ebook.pageCount ?? ''),
      featured: ebook.featured ?? false,
      active: ebook.active ?? false
    };
    showEditModal = true;
  }

  async function handleSaveEdit() {
    if (!ebook) return;
    ebook = (await updateEbook(ebook.id, {
      ...editForm,
      pageCount: editForm.pageCount ? Number(editForm.pageCount) : undefined
    })).data;
    showEditModal = false;
  }

  function openAddVersion() {
    versionForm = { region: '', price: '', currency: 'USD' };
    showVersionModal = true;
  }

  async function handleAddVersion() {
    if (!ebook) return;
    await addEbookVersion(ebook.id, {
      ...versionForm,
      price: Number(versionForm.price)
    });
    ebook = (await getEbook(ebook.id)).data;
    showVersionModal = false;
  }

  function confirmDeleteVersion(id: number) {
    deleteVersionId = id;
    showDeleteConfirm = true;
  }

  async function handleDeleteVersion() {
    if (!ebook) return;
    await deleteEbookVersion(ebook.id, deleteVersionId);
    ebook = (await getEbook(ebook.id)).data;
    showDeleteConfirm = false;
  }

  async function handlePdfUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !ebook) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ebookId', String(ebook.id));
    await uploadEbookPdf(formData);
    ebook = (await getEbook(ebook.id)).data;
  }
</script>

{#if loading}
  <LoadingSpinner />
{:else}
  <PageHeader title="Ebook: {ebook?.title ?? ''}">
    {#snippet action()}
      <Button variant="outline" onclick={openEditModal}>Edit Ebook</Button>
    {/snippet}
  </PageHeader>

  <Card class="mb-6">
    <dl class="grid grid-cols-2 gap-4">
      <div>
        <dt class="text-sm font-medium text-muted">Title</dt>
        <dd>{ebook?.title}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Author</dt>
        <dd>{ebook?.author}</dd>
      </div>
      <div class="col-span-2">
        <dt class="text-sm font-medium text-muted">Description</dt>
        <dd>{ebook?.description}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">ISBN</dt>
        <dd>{ebook?.isbn ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Page Count</dt>
        <dd>{ebook?.pageCount ?? '—'}</dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Featured</dt>
        <dd><Badge text={ebook?.featured ? 'Yes' : 'No'} variant={ebook?.featured ? 'success' : 'default'} /></dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-muted">Active</dt>
        <dd><Badge text={ebook?.active ? 'Yes' : 'No'} variant={ebook?.active ? 'success' : 'default'} /></dd>
      </div>
    </dl>
  </Card>

  <Card class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Versions / Editions</h2>
      <Button onclick={openAddVersion}>Add Version</Button>
    </div>
    <Table headers={['Region', 'Price', 'Currency', 'Created', 'Actions']}>
      {#each ebook?.versions ?? [] as version}
        <tr>
          <td>{version.region}</td>
          <td>{formatCurrency(version.price)}</td>
          <td>{version.currency}</td>
          <td>{formatDateTime(version.createdAt)}</td>
          <td>
            <Button size="sm" variant="danger" onclick={() => confirmDeleteVersion(version.id)}>Delete</Button>
          </td>
        </tr>
      {/each}
    </Table>
  </Card>

  <Card>
    <h2 class="text-lg font-semibold mb-4">Upload PDF</h2>
    <input type="file" accept=".pdf" onchange={handlePdfUpload} class="block w-full text-sm" />
  </Card>
{/if}

<Modal bind:open={showEditModal} title="Edit Ebook" onclose={() => (showEditModal = false)}>
  <form onsubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} class="space-y-4">
    <div>
      <label for="edit-title" class="block text-sm font-medium mb-1">Title</label>
      <input id="edit-title" type="text" bind:value={editForm.title} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="edit-author" class="block text-sm font-medium mb-1">Author</label>
      <input id="edit-author" type="text" bind:value={editForm.author} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="edit-description" class="block text-sm font-medium mb-1">Description</label>
      <textarea id="edit-description" bind:value={editForm.description} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" rows="4"></textarea>
    </div>
    <div>
      <label for="edit-isbn" class="block text-sm font-medium mb-1">ISBN</label>
      <input id="edit-isbn" type="text" bind:value={editForm.isbn} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
    </div>
    <div>
      <label for="edit-pageCount" class="block text-sm font-medium mb-1">Page Count</label>
      <input id="edit-pageCount" type="number" bind:value={editForm.pageCount} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
    </div>
    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={editForm.featured} />
        <span class="text-sm">Featured</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={editForm.active} />
        <span class="text-sm">Active</span>
      </label>
    </div>
    <Button type="submit">Save</Button>
  </form>
</Modal>

<Modal bind:open={showVersionModal} title="Add Version" onclose={() => (showVersionModal = false)}>
  <form onsubmit={(e) => { e.preventDefault(); handleAddVersion(); }} class="space-y-4">
    <div>
      <label for="version-region" class="block text-sm font-medium mb-1">Region</label>
      <input id="version-region" type="text" bind:value={versionForm.region} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="version-price" class="block text-sm font-medium mb-1">Price</label>
      <input id="version-price" type="number" step="0.01" bind:value={versionForm.price} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="version-currency" class="block text-sm font-medium mb-1">Currency</label>
      <input id="version-currency" type="text" bind:value={versionForm.currency} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <Button type="submit">Add</Button>
  </form>
</Modal>

<ConfirmDialog
  open={showDeleteConfirm}
  title="Confirm Delete"
  message="Are you sure you want to delete this version?"
  onconfirm={handleDeleteVersion}
  oncancel={() => (showDeleteConfirm = false)}
/>
