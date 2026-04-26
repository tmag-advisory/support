<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	open: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	confirmVariant?: 'primary' | 'danger';
	onconfirm: () => void;
	oncancel: () => void;
}

let {
	open,
	title,
	message,
	confirmLabel = 'Confirm',
	confirmVariant = 'primary',
	onconfirm,
	oncancel
}: Props = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-sm rounded-xl bg-surface p-6 shadow-xl">
			<h3 class="text-lg font-semibold text-heading">{title}</h3>
			<p class="mt-2 text-sm text-muted">{message}</p>
			<div class="mt-6 flex items-center justify-end gap-3">
				<button
					class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-body hover:bg-surface-hover"
					onclick={oncancel}
				>
					Cancel
				</button>
				<button
					class="rounded-lg px-4 py-2 text-sm font-medium text-white {confirmVariant === 'danger'
						? 'bg-danger hover:bg-danger/90'
						: 'bg-accent hover:bg-accent-hover'}"
					onclick={onconfirm}
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
