<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getUser, suspendUser, activateUser, resetUserPassword } from '$lib/api/technical';
	import type { User } from '$lib/api/types';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { formatDateTime, formatNumber, getInitials } from '$lib/utils';

	let user: User | null = $state(null);
	let loading = $state(true);
	let showPasswordReset = $state(false);

	async function loadUser() {
		loading = true;
		try {
			const res = await getUser(Number($page.params.id));
			if (res.success) {
				user = res.data;
			}
		} finally {
			loading = false;
		}
	}

	async function handleToggleStatus() {
		if (!user) return;
		if (user.status === 'ACTIVE') {
			await suspendUser(user.id);
		} else {
			await activateUser(user.id);
		}
		await loadUser();
	}

	async function handleResetPassword() {
		if (!user) return;
		await resetUserPassword(user.id);
		showPasswordReset = false;
	}

	onMount(() => {
		loadUser();
	});
</script>

{#if loading}
	<LoadingSpinner />
{:else if user}
	<PageHeader title={user.name} description={user.email}>
		{#snippet action()}
			<div class="flex gap-2">
				<Button variant={user?.status === 'ACTIVE' ? 'danger' : 'primary'} onclick={handleToggleStatus}>
					{user?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
				</Button>
				<Button variant="outline" onclick={() => (showPasswordReset = true)}>Reset Password</Button>
			</div>
		{/snippet}
	</PageHeader>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
		<a href="/users/{user.id}/credits" class="block">
			<Card class="hover:bg-button-secondary transition-colors">
				<div class="text-sm text-muted">Credits</div>
				<div class="text-2xl font-bold">{formatNumber(user.creditBalance || 0)}</div>
			</Card>
		</a>
		<a href="/users/{user.id}/plans" class="block">
			<Card class="hover:bg-button-secondary transition-colors">
				<div class="text-sm text-muted">Plans</div>
				<div class="text-2xl font-bold">View</div>
			</Card>
		</a>
		<a href="/users/{user.id}/health-profile" class="block">
			<Card class="hover:bg-button-secondary transition-colors">
				<div class="text-sm text-muted">Health Profile</div>
				<div class="text-2xl font-bold">View</div>
			</Card>
		</a>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<h3 class="text-lg font-semibold mb-4">Profile</h3>
			<dl class="space-y-2">
				<div class="flex justify-between">
					<dt class="text-muted">Name</dt>
					<dd>{user.name}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Email</dt>
					<dd>{user.email}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Phone</dt>
					<dd>{user.phone || '—'}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Location</dt>
					<dd>{user.location || '—'}</dd>
				</div>
				<div>
					<dt class="text-muted mb-1">Bio</dt>
					<dd>{user.bio || '—'}</dd>
				</div>
			</dl>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-4">Status</h3>
			<dl class="space-y-2">
				<div class="flex justify-between">
					<dt class="text-muted">Status</dt>
					<dd><Badge text={user?.status ?? ''} /></dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Onboarded</dt>
					<dd>{user.onboarded ? 'Yes' : 'No'}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Onboarding Stage</dt>
					<dd>{user.onboardingStage ?? '—'}</dd>
				</div>
				<div class="flex justify-between">
					<dt class="text-muted">Created</dt>
					<dd>{formatDateTime(user.createdAt)}</dd>
				</div>
			</dl>
		</Card>

		{#if user.company}
			<Card>
				<h3 class="text-lg font-semibold mb-4">Company</h3>
				<dl class="space-y-2">
					<div class="flex justify-between">
						<dt class="text-muted">Name</dt>
						<dd>{user.company.name}</dd>
					</div>
				</dl>
			</Card>
		{/if}
	</div>

	<Modal bind:open={showPasswordReset} title="Reset Password" onclose={() => (showPasswordReset = false)}>
		<p>Send a password reset email to <strong>{user?.email}</strong>?</p>
		{#snippet footer()}
			<Button variant="outline" onclick={() => (showPasswordReset = false)}>Cancel</Button>
			<Button onclick={handleResetPassword}>Confirm</Button>
		{/snippet}
	</Modal>
{/if}
