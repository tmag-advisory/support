<script lang="ts">
  import { onMount } from 'svelte';
  import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '$lib/api/technical';
  import type { BlogPost } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { formatDateTime, truncate } from '$lib/utils';

  let posts = $state<BlogPost[]>([]);
  let loading = $state(true);
  let showEditor = $state(false);
  let editing = $state<BlogPost | null>(null);
  let form = $state({ title: '', content: '', excerpt: '', published: false });
  let showDeleteConfirm = $state(false);
  let deleteId = $state(0);

  async function loadPosts() {
    loading = true;
    try {
      posts = (await getBlogPosts()).data.content ?? [];
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadPosts();
  });

  function openCreate() {
    editing = null;
    form = { title: '', content: '', excerpt: '', published: false };
    showEditor = true;
  }

  function openEdit(post: BlogPost) {
    editing = post;
    form = { title: post.title, content: post.content, excerpt: post.excerpt || '', published: post.published ?? false };
    showEditor = true;
  }

  async function handleSave() {
    if (editing) {
      await updateBlogPost(editing.id, form);
    } else {
      await createBlogPost(form);
    }
    showEditor = false;
    await loadPosts();
  }

  function confirmDelete(id: number) {
    deleteId = id;
    showDeleteConfirm = true;
  }

  async function handleDelete() {
    await deleteBlogPost(deleteId);
    showDeleteConfirm = false;
    await loadPosts();
  }
</script>

<PageHeader title="Blog Posts">
  {#snippet action()}
    <Button onclick={openCreate}>New Post</Button>
  {/snippet}
</PageHeader>

{#if loading}
  <LoadingSpinner />
{:else}
  <Table headers={['Title', 'Slug', 'Published', 'Created', 'Actions']}>
    {#each posts as post}
      <tr>
        <td class="px-4 py-3 text-sm text-heading">{post.title}</td>
        <td class="px-4 py-3 text-sm text-body">{post.slug || '—'}</td>
        <td class="px-4 py-3">
          {#if post.published}
            <Badge text="Published" variant="success" />
          {:else}
            <Badge text="Draft" variant="default" />
          {/if}
        </td>
        <td class="px-4 py-3 text-sm text-body">{formatDateTime(post.createdAt)}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <Button variant="outline" size="sm" onclick={() => openEdit(post)}>Edit</Button>
            <Button variant="danger" size="sm" onclick={() => confirmDelete(post.id)}>Delete</Button>
          </div>
        </td>
      </tr>
    {/each}
  </Table>
{/if}

<Modal bind:open={showEditor} title={editing ? 'Edit Post' : 'New Post'} onclose={() => (showEditor = false)}>
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
    <div>
      <label for="title" class="block text-sm font-medium text-heading">Title</label>
      <input
        id="title"
        type="text"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.title}
        required
      />
    </div>
    <div>
      <label for="content" class="block text-sm font-medium text-heading">Content</label>
      <textarea
        id="content"
        rows="8"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.content}
        required
      ></textarea>
    </div>
    <div>
      <label for="excerpt" class="block text-sm font-medium text-heading">Excerpt</label>
      <textarea
        id="excerpt"
        rows="3"
        class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        bind:value={form.excerpt}
      ></textarea>
    </div>
    <div class="flex items-center gap-2">
      <input id="published" type="checkbox" class="rounded border-border-light" bind:checked={form.published} />
      <label for="published" class="text-sm font-medium text-heading">Published</label>
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={() => (showEditor = false)}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>

<ConfirmDialog
  open={showDeleteConfirm}
  title="Delete Post"
  message="Are you sure you want to delete this post?"
  onconfirm={handleDelete}
  oncancel={() => (showDeleteConfirm = false)}
/>
