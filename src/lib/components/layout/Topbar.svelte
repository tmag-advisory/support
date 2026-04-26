<script lang="ts">
	import { sidebarOpen } from '$lib/stores/sidebar';
	import { authStore } from '$lib/stores/auth';
	import { clearTokenCookie } from '$lib/api/axios';
	import { goto } from '$app/navigation';
	import { Menu, Bell, LogOut, Coins } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let user = $derived($authStore.user);

	function handleLogout() {
		clearTokenCookie();
		authStore.logout();
		goto('/login');
	}

	const chipCls =
		'rounded-xl border border-border-light/55 bg-white/75 px-3 py-2 backdrop-blur-md shadow-[0_1px_3px_rgba(10,20,18,0.04),0_6px_20px_-14px_rgba(10,20,18,0.06)]';
</script>

<header class="sticky top-0 z-20 flex items-center justify-between mb-8 gap-4 px-4 sm:px-6">
	<div class="flex items-center gap-3 min-w-0">
		<button
			onclick={() => sidebarOpen.set(!$sidebarOpen)}
			class={cn(
				chipCls,
				'lg:hidden p-2 text-heading transition-colors duration-150 cursor-pointer shrink-0 hover:border-accent/25'
			)}
		>
			<Menu class="w-5 w-5" />
		</button>
	</div>

	<div class="flex items-center gap-3 shrink-0">
		<button class={cn(chipCls, 'hidden sm:flex items-center gap-2 px-4')}>
			<Coins class="w-4 h-4 text-accent" />
			<span class="text-sm font-semibold text-heading">Support</span>
		</button>

		<button class={cn(chipCls, 'p-2 text-heading hover:border-accent/25 cursor-pointer')}>
			<Bell class="w-5 h-5" />
		</button>
	</div>
</header>
