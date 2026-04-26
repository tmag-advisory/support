<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		label: string;
		value: string;
		icon?: Snippet;
		trend?: number;
		class?: string;
	}

	let { label, value, icon, trend, class: className }: Props = $props();
</script>

<div
	class={cn(
		'rounded-3xl border border-border-light/60 bg-white/90 backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(10,20,18,0.04),0_8px_28px_-18px_rgba(10,20,18,0.07)] p-5 sm:p-6',
		className
	)}
>
	<div class="flex items-center justify-between">
		<p class="text-sm font-medium text-muted">{label}</p>
		{#if icon}
			<div class="rounded-xl bg-accent/10 p-2.5">
				{@render icon()}
			</div>
		{/if}
	</div>
	<p class="mt-2 text-2xl sm:text-3xl font-semibold text-heading">{value}</p>
	{#if trend !== undefined}
		<div class="mt-2 flex items-center gap-1 text-sm">
			<span class={trend >= 0 ? 'text-accent' : 'text-red-500'}>
				{trend >= 0 ? '+' : ''}{trend}%
			</span>
			<span class="text-muted">from last month</span>
		</div>
	{/if}
</div>
