<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value: string;
		placeholder?: string;
		onInput: (value: string) => void;
		class?: string;
	}

	let { value = $bindable(), placeholder = 'Search...', onInput, class: className }: Props = $props();
</script>

<div class={cn('relative', className)}>
	<svg
		class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
	>
		<circle cx="11" cy="11" r="8" />
		<path d="M21 21l-4.35-4.35" />
	</svg>
	<input
		type="text"
		{placeholder}
		bind:value
		oninput={(e) => onInput((e.target as HTMLInputElement).value)}
		class="w-full rounded-xl border border-border bg-white/75 py-2 pl-10 pr-4 text-sm text-body placeholder:text-muted focus:border-accent/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all duration-150"
	/>
</div>
