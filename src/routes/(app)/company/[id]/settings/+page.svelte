<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getCompany, updateCompany } from '$lib/api/company';
  import type { Company } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

  let company: Company | null = $state(null);
  let loading = $state(true);
  let saving = $state(false);
  let form = $state({
    name: '',
    industry: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  onMount(async () => {
    const id = Number($page.params.id);
    try {
      company = (await getCompany(id)).data;
      form = {
        name: company?.name ?? '',
        industry: company?.industry ?? '',
        website: company?.website ?? '',
        contactEmail: company?.contactEmail ?? '',
        contactPhone: company?.contactPhone ?? '',
        address: company?.address ?? ''
      };
    } finally {
      loading = false;
    }
  });

  async function handleSave() {
    if (!company) return;
    saving = true;
    try {
      company = (await updateCompany(company.id, form)).data;
    } finally {
      saving = false;
    }
  }
</script>

{#if loading}
  <LoadingSpinner />
{:else}
  <PageHeader
    title="Settings - {company?.name ?? ''}"
  />

  <Card class="mb-6">
    <form onsubmit={(e) => { e.preventDefault(); handleSave(); }} class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium mb-1">Name</label>
        <input
          id="name"
          type="text"
          bind:value={form.name}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label for="industry" class="block text-sm font-medium mb-1">Industry</label>
        <input
          id="industry"
          type="text"
          bind:value={form.industry}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label for="website" class="block text-sm font-medium mb-1">Website</label>
        <input
          id="website"
          type="text"
          bind:value={form.website}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label for="contactEmail" class="block text-sm font-medium mb-1">Contact Email</label>
        <input
          id="contactEmail"
          type="email"
          bind:value={form.contactEmail}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label for="contactPhone" class="block text-sm font-medium mb-1">Contact Phone</label>
        <input
          id="contactPhone"
          type="text"
          bind:value={form.contactPhone}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label for="address" class="block text-sm font-medium mb-1">Address</label>
        <input
          id="address"
          type="text"
          bind:value={form.address}
          class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors"
        />
      </div>
      <Button type="submit" loading={saving}>Save</Button>
    </form>
  </Card>

  <Card>
    <h2 class="text-lg font-semibold mb-2">Billing Currency</h2>
    <p class="text-sm">{company?.billingCurrency ?? 'Not set'}</p>
  </Card>
{/if}
