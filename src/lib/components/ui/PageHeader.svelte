<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		action?: Snippet;
	}

	let { title, description, action }: Props = $props();
</script>

<div class="mb-6 flex items-start justify-between gap-4">
	<div>
		<h1 class="text-xl sm:text-2xl md:text-3xl font-serif text-heading tracking-tight">
			{title}
		</h1>
		{#if description}
			<p class="mt-1 text-sm text-muted">{description}</p>
		{/if}
	</div>
	{#if action}
		<div class="flex items-center gap-2 shrink-0">{@render action()}</div>
	{/if}
</div>
