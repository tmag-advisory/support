<script lang="ts">
interface Props {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pageSize?: number;
	onPageSizeChange?: (size: number) => void;
}

let {
	currentPage,
	totalPages,
	onPageChange,
	pageSize = 20,
	onPageSizeChange
}: Props = $props();

function getPageNumbers(): (number | '...')[] {
	const pages: (number | '...')[] = [];
	if (totalPages <= 7) {
		for (let i = 0; i < totalPages; i++) pages.push(i);
		return pages;
	}
	pages.push(0);
	if (currentPage > 2) pages.push('...');
	for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
		pages.push(i);
	}
	if (currentPage < totalPages - 3) pages.push('...');
	pages.push(totalPages - 1);
	return pages;
}
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-between px-2">
		<div class="flex items-center gap-2 text-sm text-muted">
			{#if onPageSizeChange}
				<select
					class="rounded-lg border border-border bg-surface px-2 py-1 text-sm"
					value={pageSize}
					onchange={(e) => onPageSizeChange?.(Number((e.target as HTMLSelectElement).value))}
				>
					{#each [10, 20, 50, 100] as size}
						<option value={size}>{size} per page</option>
					{/each}
				</select>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			<button
				class="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-hover disabled:opacity-50"
				disabled={currentPage === 0}
				onclick={() => onPageChange(currentPage - 1)}
			>
				Previous
			</button>
			{#each getPageNumbers() as page}
				{#if page === '...'}
					<span class="px-2 text-muted">…</span>
				{:else}
					<button
						class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {page === currentPage
							? 'bg-accent text-white'
							: 'text-muted hover:bg-surface-hover'}"
						onclick={() => onPageChange(page as number)}
					>
						{(page as number) + 1}
					</button>
				{/if}
			{/each}
			<button
				class="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-hover disabled:opacity-50"
				disabled={currentPage === totalPages - 1}
				onclick={() => onPageChange(currentPage + 1)}
			>
				Next
			</button>
		</div>
	</div>
{/if}
