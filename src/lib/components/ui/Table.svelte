<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		loading?: boolean;
		empty?: boolean;
		emptyMessage?: string;
		class?: string;
		headers: string[];
		children: Snippet;
	}

	let {
		loading = false,
		empty = false,
		emptyMessage = 'No data found.',
		class: className,
		headers,
		children
	}: Props = $props();
</script>

<div
	class={cn(
		'overflow-hidden rounded-3xl border border-border-light/60 bg-white backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(10,20,18,0.04),0_8px_28px_-18px_rgba(10,20,18,0.07)]',
		className
	)}
>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border-light/50 bg-white/50">
					{#each headers as header}
						<th class="px-4 sm:px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">
							{header}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-border-light/50">
				{#if loading}
					{#each Array(5) as _}
						<tr>
							{#each headers as _}
								<td class="px-4 sm:px-6 py-4">
									<div class="h-4 w-full rounded bg-border-light/50 animate-pulse"></div>
								</td>
							{/each}
						</tr>
					{/each}
				{:else if empty}
					<tr>
						<td colspan={headers.length} class="px-4 sm:px-6 py-12 text-center text-muted">
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{@render children()}
				{/if}
			</tbody>
		</table>
	</div>
</div>
