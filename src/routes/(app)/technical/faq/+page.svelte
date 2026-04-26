<script lang="ts">
  import { onMount } from 'svelte';
  import { getFaqItems, createFaqItem, updateFaqItem, deleteFaqItem } from '$lib/api/technical';
  import type { FaqItem } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { truncate } from '$lib/utils';

  let items = $state<FaqItem[]>([]);
  let loading = $state(true);
  let showEditor = $state(false);
  let editing = $state<FaqItem | null>(null);
  let form = $state({ question: '', answer: '', category: '' });
  let showDeleteConfirm = $state(false);
  let deleteId = $state(0);

  async function loadItems() {
    loading = true;
    try {
      items = (await getFaqItems()).data ?? [];
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadItems();
  });

  function openCreate() {
    editing = null;
    form = { question: '', answer: '', category: '' };
    showEditor = true;
  }

  function openEdit(item: FaqItem) {
    editing = item;
    form = { question: item.question, answer: item.answer, category: item.category || '' };
    showEditor = true;
  }

  async function handleSave() {
    if (editing) {
      await updateFaqItem(editing.id, form);
    } else {
      await createFaqItem(form);
    }
    showEditor = false;
    await loadItems();
  }

  function confirmDelete(id: number) {
    deleteId = id;
    showDeleteConfirm = true;
  }

  async function handleDelete() {
    await deleteFaqItem(deleteId);
    showDeleteConfirm = false;
    await loadItems();
  }
</script>

<PageHeader title="FAQ">
  {#snippet action()}
    <Button onclick={openCreate}>Add Question</Button>
  {/snippet}
</PageHeader>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table headers={['Question', 'Category', 'Active', 'Actions']}>
    {#each items as item}
      <tr>
        <td class="px-4 py-3 text-sm text-heading">{truncate(item.question, 80)}</td>
        <td class="px-4 py-3 text-sm text-body">{item.category || '—'}</td>
        <td class="px-4 py-3 text-sm text-heading">{item.active ? 'Yes' : '—'}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <Button variant="outline" size="sm" onclick={() => openEdit(item)}>Edit</Button>
            <Button variant="danger" size="sm" onclick={() => confirmDelete(item.id)}>Delete</Button>
          </div>
        </td>
      </tr>
    {/each}
  </Table>
{/if}

<Modal bind:open={showEditor} title={editing ? 'Edit FAQ' : 'Add Question'} onclose={() => (showEditor = false)}>
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
    <div>
      <label for="question" class="block text-sm font-medium text-heading">Question</label>
      <input
        id="question"
        type="text"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.question}
        required
      />
    </div>
    <div>
      <label for="answer" class="block text-sm font-medium text-heading">Answer</label>
      <textarea
        id="answer"
        rows="6"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.answer}
        required
      ></textarea>
    </div>
    <div>
      <label for="category" class="block text-sm font-medium text-heading">Category</label>
      <input
        id="category"
        type="text"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.category}
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={() => (showEditor = false)}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>

<ConfirmDialog
  open={showDeleteConfirm}
  title="Delete FAQ"
  message="Are you sure you want to delete this FAQ item?"
  onconfirm={handleDelete}
  oncancel={() => (showDeleteConfirm = false)}
/>
