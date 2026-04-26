<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
		padding?: boolean;
	}

	let { class: className, children, padding = true }: Props = $props();
</script>

<div
	class="rounded-3xl border border-border-light/60 bg-white backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(10,20,18,0.04),0_8px_28px_-18px_rgba(10,20,18,0.07)] {padding
		? 'p-5 sm:p-6'
		: ''} {className}"
>
	{@render children()}
</div>
