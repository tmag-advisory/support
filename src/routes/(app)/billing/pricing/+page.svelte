<script lang="ts">
	import { getCompanyPricing, getCompanyQuote } from '$lib/api/billing';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	let companyId = $state<number | null>(null);
	let credits = $state<number>(100);
	
	let loadingPricing = $state(false);
	let pricingData = $state<any>(null);
	
	let loadingQuote = $state(false);
	let quoteData = $state<any>(null);
	
	let error = $state('');

	async function fetchPricing() {
		if (!companyId) return;
		loadingPricing = true;
		error = '';
		quoteData = null;
		try {
			const res = await getCompanyPricing(companyId);
			pricingData = res.data;
		} catch (e: any) {
			error = e.response?.data?.message || 'Failed to fetch pricing';
			pricingData = null;
		} finally {
			loadingPricing = false;
		}
	}

	async function fetchQuote() {
		if (!companyId || !credits) return;
		loadingQuote = true;
		error = '';
		try {
			const res = await getCompanyQuote(companyId, credits);
			quoteData = res.data;
		} catch (e: any) {
			error = e.response?.data?.message || 'Failed to fetch quote';
			quoteData = null;
		} finally {
			loadingQuote = false;
		}
	}
</script>

<PageHeader title="Credit Quotes & Pricing" description="Calculate pricing tiers, per-credit costs, and quotes for companies" />

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
	<!-- Calculator Form -->
	<div class="bg-white rounded-xl shadow-sm border border-border-light p-6">
		<h3 class="text-lg font-semibold mb-4">Pricing Calculator</h3>
		
		{#if error}
			<div class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
				{error}
			</div>
		{/if}

		<div class="space-y-4">
			<div>
				<label for="companyId" class="block text-sm font-medium mb-1">Company ID</label>
				<div class="flex gap-2">
					<input 
						type="number" 
						id="companyId" 
						bind:value={companyId} 
						placeholder="Enter Company ID"
						class="flex-1 rounded-xl border border-border-light bg-white px-4 py-2 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
					/>
					<Button onclick={fetchPricing} disabled={!companyId || loadingPricing}>
						{loadingPricing ? 'Loading...' : 'Load Pricing'}
					</Button>
				</div>
				<p class="text-xs text-text-light mt-1">Enter a company ID to view their specific pricing tiers and base currency.</p>
			</div>

			<div>
				<label for="credits" class="block text-sm font-medium mb-1">Number of Credits</label>
				<input 
					type="number" 
					id="credits" 
					bind:value={credits} 
					placeholder="Enter amount of credits"
					class="w-full rounded-xl border border-border-light bg-white px-4 py-2 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
				/>
			</div>

			<Button class="w-full" onclick={fetchQuote} disabled={!companyId || !credits || loadingQuote}>
				{loadingQuote ? 'Calculating...' : 'Generate Quote'}
			</Button>
		</div>
	</div>

	<!-- Results Panel -->
	<div class="space-y-6">
		{#if pricingData}
			<div class="bg-white rounded-xl shadow-sm border border-border-light p-6">
				<h3 class="text-lg font-semibold mb-4">Company Pricing Info</h3>
				<div class="grid grid-cols-2 gap-4 text-sm mb-6">
					<div>
						<p class="text-text-light">Company</p>
						<p class="font-medium">{pricingData.companyName} (ID: {pricingData.companyId})</p>
					</div>
					<div>
						<p class="text-text-light">Currency</p>
						<p class="font-medium">{pricingData.currency} ({pricingData.currencySymbol})</p>
					</div>
					<div>
						<p class="text-text-light">Current Tier</p>
						<p class="font-medium">{pricingData.appliedTier}</p>
					</div>
				</div>

				<h4 class="font-medium mb-2 text-sm text-text-light uppercase tracking-wider">Volume Pricing</h4>
				<div class="border rounded-lg overflow-hidden">
					<table class="w-full text-sm text-left">
						<thead class="bg-bg-light border-b text-text-light">
							<tr>
								<th class="px-4 py-2 font-medium">Tier</th>
								<th class="px-4 py-2 font-medium">Volume</th>
								<th class="px-4 py-2 font-medium text-right">Standard</th>
								<th class="px-4 py-2 font-medium text-right">Premium</th>
							</tr>
						</thead>
						<tbody class="divide-y">
							<tr>
								<td class="px-4 py-2">Tier 1</td>
								<td class="px-4 py-2">1 – {pricingData.tier1MaxCredits}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.standardTier1Price?.toFixed(2)}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.premiumTier1Price?.toFixed(2)}</td>
							</tr>
							<tr>
								<td class="px-4 py-2">Tier 2</td>
								<td class="px-4 py-2">{pricingData.tier1MaxCredits + 1} – {pricingData.tier2MaxCredits}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.standardTier2Price?.toFixed(2)}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.premiumTier2Price?.toFixed(2)}</td>
							</tr>
							<tr>
								<td class="px-4 py-2">Tier 3</td>
								<td class="px-4 py-2">{pricingData.tier2MaxCredits + 1} – {pricingData.tier3MaxCredits}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.standardTier3Price?.toFixed(2)}</td>
								<td class="px-4 py-2 text-right">{pricingData.currencySymbol}{pricingData.premiumTier3Price?.toFixed(2)}</td>
							</tr>
							{#if pricingData.qualifiesForContactSales}
								<tr class="bg-accent/5">
									<td class="px-4 py-2 font-medium text-accent">500+</td>
									<td class="px-4 py-2 font-medium text-accent">Contact Sales</td>
									<td class="px-4 py-2 text-right font-medium text-accent" colspan={2}>Custom</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if quoteData}
			<div class="bg-accent text-white rounded-xl shadow-sm p-6 relative overflow-hidden">
				<div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
				
				<h3 class="text-lg font-semibold mb-4 relative z-10">Purchase Quote</h3>
				
				<div class="grid grid-cols-2 gap-4 text-sm relative z-10">
					<div>
						<p class="text-white/70 mb-1">Requested Credits</p>
						<p class="text-2xl font-bold">{quoteData.credits}</p>
					</div>
					<div class="text-right">
						<p class="text-white/70 mb-1">Total Cost</p>
						<p class="text-2xl font-bold">{quoteData.currencySymbol}{quoteData.totalAmount?.toFixed(2)}</p>
					</div>
					
					<div class="col-span-2 mt-2 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
						<div>
							<p class="text-white/70 mb-1">Applied Tier</p>
							<p class="font-medium">{quoteData.appliedTier}</p>
						</div>
						<div class="text-right">
							<p class="text-white/70 mb-1">Price per Credit</p>
							<p class="font-medium">{quoteData.currencySymbol}{quoteData.pricePerCredit?.toFixed(2)}</p>
						</div>
					</div>
					
					{#if quoteData.qualifiesForContactSales}
						<div class="col-span-2 mt-4 bg-white/20 p-3 rounded-lg flex items-center justify-center">
							<span class="font-medium">Large volume request. Escalate to Sales for custom pricing.</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>