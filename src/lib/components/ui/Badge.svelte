<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		text: string;
		variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
		class?: string;
	}

	let { text, variant, class: className }: Props = $props();

	const variantClasses: Record<string, string> = {
		default: 'bg-white/75 text-muted border border-border-light/50',
		success: 'bg-accent/10 text-accent',
		warning: 'bg-gold/10 text-gold',
		danger: 'bg-red-50 text-red-600',
		info: 'bg-blue-50 text-blue-600'
	};

	let v = $derived(variant || 'default');
</script>

<span
	class={cn(
		'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
		variant ? variantClasses[v] : variantClasses.default,
		className
	)}
>
	{text}
</span>
