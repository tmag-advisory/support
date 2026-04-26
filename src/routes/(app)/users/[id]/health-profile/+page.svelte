<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/api/axios';
	import { getUser } from '$lib/api/technical';
	import type { User } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	let user: User | null = $state(null);
	let profile: any = $state(null);
	let loading = $state(true);

	async function loadData() {
		loading = true;
		try {
			const userId = Number($page.params.id);
			const u = await getUser(userId);
			if (u.success) user = u.data;
			const res = await api.get(`/health-profiles?userId=${userId}`);
			profile = res.data?.data?.[0] ?? null;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

{#if loading}
	<LoadingSpinner />
{:else}
	<PageHeader title="Health Profile - {user?.name ?? ''}" description="View user health profile">
		{#snippet action()}
			<a href="/users/{$page.params.id}" class="text-sm text-muted hover:underline">
				&larr; Back to user
			</a>
		{/snippet}
	</PageHeader>

	{#if profile}
		<Card>
			<h3 class="text-lg font-semibold mb-4">Health Profile</h3>
			<dl class="space-y-2">
				{#each Object.entries(profile) as [key, value]}
					<div class="flex justify-between">
						<dt class="text-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
						<dd>{value ?? '—'}</dd>
					</div>
				{/each}
			</dl>
		</Card>
	{:else}
		<EmptyState message="This user has not completed a health profile yet." />
	{/if}
{/if}
