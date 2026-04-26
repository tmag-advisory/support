<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { clearTokenCookie } from '$lib/api/axios';
	import { login as loginApi } from '$lib/api/auth';
	import { Eye, EyeOff, Lock } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		authStore.init();
		const unsub = authStore.subscribe((s) => {
			if (s.isAuthenticated) {
				goto('/dashboard');
			}
		});
		return unsub;
	});

	async function handleLogin(e: Event) {
		e.preventDefault();
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}
		error = '';
		loading = true;
		try {
			const res = await loginApi(email, password);
			if (res.success && res.data) {
				const { token, exp, user } = res.data;
				document.cookie = `support_access_token=${encodeURIComponent(token)}; path=/; expires=${new Date(exp).toUTCString()}; SameSite=Lax`;
				authStore.login(user);
				goto('/dashboard');
			} else {
				error = res.message || 'Login failed';
			}
		} catch (err: any) {
			error = err?.response?.data?.message || 'Invalid credentials. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-background flex flex-col">
	<div class="flex-1 flex items-center justify-center px-6 py-16">
		<div class="w-full max-w-md">
			<a href="/dashboard" class="inline-block mb-8">
				<span class="text-xl font-serif font-medium tracking-tight text-heading">TMAG</span>
				<span class="block text-[10px] text-muted uppercase tracking-widest mt-1">Support</span>
			</a>

			<h1 class="text-3xl md:text-4xl font-serif text-heading mb-2">Sign in</h1>
			<p class="text-sm text-body mb-8">Access the support console to manage the platform.</p>

			{#if error}
				<div class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
					{error}
				</div>
			{/if}

			<form onsubmit={handleLogin} class="space-y-4">
				<div>
					<label for="email" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="admin@example.com"
						class="w-full bg-white border border-border-light rounded-xl px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors duration-200"
						required
					/>
				</div>
				<div>
					<label for="password" class="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
						Password
					</label>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							class="w-full bg-white border border-border-light rounded-xl px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors duration-200 pr-10"
							required
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
						>
							{#if showPassword}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-3 rounded-xl bg-dark text-background font-semibold text-sm cursor-pointer hover:bg-darkest transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>

			<p class="text-xs text-muted text-center mt-8 flex items-center justify-center gap-1.5">
				<Lock class="w-3 h-3" />
				Only authorized support personnel can access this portal.
			</p>
		</div>
	</div>
</div>
