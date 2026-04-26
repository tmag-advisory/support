<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { getMe } from '$lib/api/auth';
	import AppLayout from '$lib/components/layout/AppLayout.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	let { children } = $props();
	let authChecked = $state(false);

	onMount(async () => {
		authStore.init();
		try {
			const res = await getMe();
			if (res.success && res.data) {
				authStore.login(res.data);
			}
		} catch {
			authStore.logout();
			goto('/login');
			return;
		}
		authChecked = true;
	});
</script>

{#if !authChecked}
	<div class="flex h-screen items-center justify-center bg-background-primary">
		<LoadingSpinner />
	</div>
{:else}
	<AppLayout>
		{@render children()}
	</AppLayout>
{/if}
