<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		children,
		class: className,
		disabled,
		...rest
	}: Props = $props();

	const variants = {
		primary:
			'bg-accent text-white hover:bg-accent-hover active:bg-accent/90 shadow-sm',
		secondary:
			'bg-button-secondary text-heading hover:bg-border-light/50 active:bg-border-light border border-border-light/50',
		outline:
			'bg-button-secondary text-heading hover:bg-border-light/50 active:bg-border-light border border-border-light/50',
		danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
		ghost: 'text-body hover:bg-border-light/30 active:bg-border-light/50'
	};

	const sizes = {
		sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-xl',
		md: 'px-4 py-2 text-sm font-semibold rounded-xl',
		lg: 'px-6 py-2.5 text-base font-semibold rounded-xl'
	};
</script>

<button
	class={cn(
		'inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50',
		variants[variant],
		sizes[size],
		className
	)}
	disabled={disabled || loading}
	{...rest}
>
	{#if loading}
		<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
		</svg>
	{/if}
	{@render children()}
</button>
