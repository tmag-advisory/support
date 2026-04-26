<script lang="ts">
import type { Snippet } from 'svelte';
import { cn } from '$lib/utils';

interface Props {
	items: { id: string; label: string }[];
	active: string;
	onchange: (id: string) => void;
	class?: string;
}

let { items, active, onchange, class: className }: Props = $props();
</script>

<div class={cn('flex border-b border-border', className)}>
	{#each items as item}
		<button
			class="relative px-4 py-2.5 text-sm font-medium transition-colors {item.id === active
				? 'text-accent'
				: 'text-muted hover:text-body'}"
			onclick={() => onchange(item.id)}
		>
			{item.label}
			{#if item.id === active}
				<div class="absolute inset-x-0 bottom-0 h-0.5 bg-accent"></div>
			{/if}
		</button>
	{/each}
</div>
