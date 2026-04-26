<script lang="ts">
	import { createEbook } from '$lib/api/technical';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';

	let form = $state({ title: '', author: '', description: '', isbn: '', pageCount: '' });
	let saving = $state(false);

	async function handleSubmit() {
		saving = true;
		try {
			const payload = {
				title: form.title,
				author: form.author,
				description: form.description,
				isbn: form.isbn,
				pageCount: form.pageCount ? Number(form.pageCount) : undefined
			};
			await createEbook(payload);
			goto('/technical/ebooks');
		} finally {
			saving = false;
		}
	}
</script>

<PageHeader title="Create Ebook">
	{#snippet action()}
		<Button variant="secondary"><a href="/technical/ebooks">Back to Ebooks</a></Button>
	{/snippet}
</PageHeader>

<Card>
	<form onsubmit={handleSubmit} class="space-y-4">
		<div>
			<label for="title" class="block text-sm font-medium mb-1">Title</label>
			<input id="title" type="text" bind:value={form.title} required class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="author" class="block text-sm font-medium mb-1">Author</label>
			<input id="author" type="text" bind:value={form.author} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="description" class="block text-sm font-medium mb-1">Description</label>
			<textarea id="description" bind:value={form.description} rows="4" class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"></textarea>
		</div>
		<div>
			<label for="isbn" class="block text-sm font-medium mb-1">ISBN</label>
			<input id="isbn" type="text" bind:value={form.isbn} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div>
			<label for="pageCount" class="block text-sm font-medium mb-1">Page Count</label>
			<input id="pageCount" type="number" bind:value={form.pageCount} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" />
		</div>
		<div class="flex justify-end gap-2">
			<Button variant="secondary" onclick={() => goto('/technical/ebooks')}>Cancel</Button>
			<Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
		</div>
	</form>
</Card>
