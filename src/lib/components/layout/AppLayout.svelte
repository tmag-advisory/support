<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';
	import { sidebarOpen } from '$lib/stores/sidebar';
	import { cn } from '$lib/utils';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="relative flex min-h-screen bg-background">
	<!-- Ambient background blobs -->
	<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
		<div class="absolute -top-10 right-0 h-52 w-52 rounded-full bg-accent/10 blur-3xl sm:h-64 sm:w-64"></div>
		<div class="absolute left-0 top-40 h-56 w-56 rounded-full bg-gold/10 blur-3xl sm:top-52 sm:h-72 sm:w-72"></div>
		<div class="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl"></div>
	</div>

	<!-- Sidebar -->
	<Sidebar />

	<!-- Mobile overlay -->
	{#if $sidebarOpen}
		<div
			class="fixed inset-0 z-30 bg-black/40 lg:hidden"
			onclick={() => sidebarOpen.set(false)}
			onkeydown={(e) => e.key === 'Enter' && sidebarOpen.set(false)}
			role="button"
			tabindex="-1"
			aria-label="Close sidebar"
		></div>
	{/if}

	<!-- Main content -->
	<div class="flex flex-1 flex-col lg:pl-64">
			<Topbar />
			<main class="relative z-10 flex-1 overflow-y-auto">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
					{@render children()}
				</div>
			</main>
		</div>
</div>
