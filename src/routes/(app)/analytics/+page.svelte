<script lang="ts">
	import { onMount } from 'svelte';
	import { getAnalytics } from '$lib/api/technical';
	import type { AnalyticsData } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatNumber } from '$lib/utils';

	let analytics = $state<AnalyticsData | null>(null);
	let loading = $state(true);

	onMount(async () => {
		loading = true;
		try {
			const res = await getAnalytics();
			if (res.success) analytics = res.data;
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<PageHeader title="Analytics" description="Platform analytics and insights" />

{#if loading}
	<LoadingSpinner />
{:else if analytics}
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		{#if analytics.topDestinations && analytics.topDestinations.length > 0}
			<Card>
				{#snippet children()}
					<h3 class="mb-4 text-lg font-semibold text-heading">Top Destinations</h3>
					<ul class="space-y-3">
						{#each (analytics?.topDestinations ?? []).slice(0, 8) as dest}
							<li class="flex items-center justify-between">
								<span class="text-sm text-body">{dest.destination}</span>
								<span class="text-sm font-medium text-muted">{formatNumber(dest.count)}</span>
							</li>
						{/each}
					</ul>
				{/snippet}
			</Card>
		{/if}

		{#if analytics.userGrowth && analytics.userGrowth.length > 0}
			<Card>
				{#snippet children()}
					<h3 class="mb-4 text-lg font-semibold text-heading">User Growth</h3>
					<ul class="space-y-3">
						{#each (analytics?.userGrowth ?? []).slice(0, 8) as period}
							<li class="flex items-center justify-between">
								<span class="text-sm text-body">{period.date}</span>
								<span class="text-sm font-medium text-muted">{formatNumber(period.count)} users</span>
							</li>
						{/each}
					</ul>
				{/snippet}
			</Card>
		{/if}

		{#if analytics.planGeneration && analytics.planGeneration.length > 0}
			<Card>
				{#snippet children()}
					<h3 class="mb-4 text-lg font-semibold text-heading">Plan Generation</h3>
					<ul class="space-y-3">
						{#each (analytics?.planGeneration ?? []).slice(0, 8) as p}
							<li class="flex items-center justify-between">
								<span class="text-sm text-body">{p.date}</span>
								<span class="text-sm font-medium text-muted">{formatNumber(p.count)} plans</span>
							</li>
						{/each}
					</ul>
				{/snippet}
			</Card>
		{/if}

		{#if analytics.creditConsumption && analytics.creditConsumption.length > 0}
			<Card>
				{#snippet children()}
					<h3 class="mb-4 text-lg font-semibold text-heading">Credit Consumption</h3>
					<ul class="space-y-3">
						{#each (analytics?.creditConsumption ?? []).slice(0, 8) as c}
							<li class="flex items-center justify-between">
								<span class="text-sm text-body">{c.date}</span>
								<span class="text-sm font-medium text-muted">{formatNumber(c.amount)} credits</span>
							</li>
						{/each}
					</ul>
				{/snippet}
			</Card>
		{/if}
	</div>
{:else}
	<div class="py-12 text-center text-muted">No analytics data available.</div>
{/if}