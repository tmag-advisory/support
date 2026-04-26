<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open = $bindable(), title, size = 'md', onclose, children, footer }: Props = $props();

	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class={cn('w-full rounded-2xl bg-white shadow-xl', sizes[size])}>
			{#if title}
				<div class="flex items-center justify-between border-b border-border-light px-6 py-4">
					<h2 class="text-lg font-semibold text-heading">{title}</h2>
					<button
						onclick={onclose}
						class="rounded-lg p-1.5 text-muted hover:bg-button-secondary transition-colors cursor-pointer"
					>
						&times;
					</button>
				</div>
			{/if}
			<div class="px-6 py-4">
				{@render children()}
			</div>
			{#if footer}
				<div class="flex items-center justify-end gap-3 border-t border-border-light px-6 py-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
