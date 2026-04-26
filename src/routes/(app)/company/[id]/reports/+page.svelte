<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import api from '$lib/api/axios';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	let loading = $state(true);

	const companyId = $derived($page.params.id);

	onMount(() => {
		loading = false;
	});

	function downloadUsage() {
		window.open(`${api.defaults.baseURL}/company-admin/reports/usage/csv`, '_blank');
	}

	function downloadPlanHistory() {
		window.open(`${api.defaults.baseURL}/company-admin/reports/plans/csv`, '_blank');
	}

	function downloadCompliance() {
		window.open(`${api.defaults.baseURL}/company-admin/reports/compliance/csv`, '_blank');
	}

	function downloadTeam() {
		window.open(`${api.defaults.baseURL}/company-admin/reports/team/csv`, '_blank');
	}
</script>

<PageHeader title="Reports" />

{#if loading}
	<LoadingSpinner />
{:else}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<Card>
			<div class="flex flex-col gap-3">
				<h3 class="text-lg font-semibold">Usage Report</h3>
				<p class="text-sm text-muted">
					Detailed breakdown of platform usage including consultations, API calls, and feature engagement metrics.
				</p>
				<Button onclick={downloadUsage}>Download CSV</Button>
			</div>
		</Card>

		<Card>
			<div class="flex flex-col gap-3">
				<h3 class="text-lg font-semibold">Plan History</h3>
				<p class="text-sm text-muted">
					Complete history of subscription plan changes, upgrades, downgrades, and billing adjustments.
				</p>
				<Button onclick={downloadPlanHistory}>Download CSV</Button>
			</div>
		</Card>

		<Card>
			<div class="flex flex-col gap-3">
				<h3 class="text-lg font-semibold">Compliance</h3>
				<p class="text-sm text-muted">
					Compliance status for all team members including vaccination records, health screenings, and certification tracking.
				</p>
				<Button onclick={downloadCompliance}>Download CSV</Button>
			</div>
		</Card>

		<Card>
			<div class="flex flex-col gap-3">
				<h3 class="text-lg font-semibold">Team Report</h3>
				<p class="text-sm text-muted">
					Overview of team composition, member activity, department distribution, and onboarding progress.
				</p>
				<Button onclick={downloadTeam}>Download CSV</Button>
			</div>
		</Card>
	</div>
{/if}
