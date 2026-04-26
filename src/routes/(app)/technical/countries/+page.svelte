<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    getHealthAlerts,
    createHealthAlert,
    deleteHealthAlert
  } from '$lib/api/technical';
  import type { Country, HealthAlert } from '$lib/api/types';
  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import Table from '$lib/components/ui/Table.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Tabs from '$lib/components/ui/Tabs.svelte';
  import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
  import { formatDateTime } from '$lib/utils';

  let countries: Country[] = $state([]);
  let alerts: HealthAlert[] = $state([]);
  let loading = $state(true);
  let activeTab = $state('countries');
  let showCountryModal = $state(false);
  let showAlertModal = $state(false);
  let editingCountry: Country | null = $state(null);
  let countryForm = $state({ name: '', code: '', region: '' });
  let alertForm = $state({ countryId: 0, title: '', description: '', severity: '' });
  let showDeleteConfirm = $state(false);
  let deleteTarget = $state({ type: '', id: 0 });

  const tabItems = [
    { id: 'countries', label: 'Countries' },
    { id: 'alerts', label: 'Health Alerts' }
  ];

  onMount(async () => {
    try {
      [countries, alerts] = await Promise.all([getCountries().then(r => r.data), getHealthAlerts().then(r => r.data)]);
    } finally {
      loading = false;
    }
  });

  function openCreateCountry() {
    editingCountry = null;
    countryForm = { name: '', code: '', region: '' };
    showCountryModal = true;
  }

  function openEditCountry(country: Country) {
    editingCountry = country;
    countryForm = { name: country.name, code: country.code, region: country.region ?? '' };
    showCountryModal = true;
  }

  async function handleSaveCountry() {
    if (editingCountry) {
      await updateCountry(editingCountry.id, countryForm);
    } else {
      await createCountry(countryForm);
    }
    countries = (await getCountries()).data;
    showCountryModal = false;
  }

  function confirmDelete(type: string, id: number) {
    deleteTarget = { type, id };
    showDeleteConfirm = true;
  }

  async function handleDelete() {
    if (deleteTarget.type === 'country') {
      await deleteCountry(deleteTarget.id);
      countries = (await getCountries()).data;
    } else if (deleteTarget.type === 'alert') {
      await deleteHealthAlert(deleteTarget.id);
      alerts = (await getHealthAlerts()).data;
    }
    showDeleteConfirm = false;
  }

  function openCreateAlert() {
    alertForm = { countryId: 0, title: '', description: '', severity: '' };
    showAlertModal = true;
  }

  async function handleSaveAlert() {
    await createHealthAlert(alertForm);
    alerts = (await getHealthAlerts()).data;
    showAlertModal = false;
  }
</script>

<PageHeader title="Countries & Health Alerts" />

{#if loading}
  <LoadingSpinner />
{:else}
  <Tabs items={tabItems} active={activeTab} onchange={(id) => (activeTab = id)} />

  {#if activeTab === 'countries'}
    <div class="mb-4">
      <Button onclick={openCreateCountry}>Create Country</Button>
    </div>
    <Table headers={['Name', 'Code', 'Region', 'Actions']}>
      {#each countries as country}
        <tr>
          <td>{country.name}</td>
          <td>{country.code}</td>
          <td>{country.region}</td>
          <td class="flex gap-2">
            <Button size="sm" variant="outline" onclick={() => openEditCountry(country)}>Edit</Button>
            <Button size="sm" variant="danger" onclick={() => confirmDelete('country', country.id)}>Delete</Button>
          </td>
        </tr>
      {/each}
    </Table>
  {/if}

  {#if activeTab === 'alerts'}
    <div class="mb-4">
      <Button onclick={openCreateAlert}>Create Alert</Button>
    </div>
    <Table headers={['Country', 'Title', 'Severity', 'Active', 'Created', 'Actions']}>
      {#each alerts as alert}
        <tr>
          <td>{countries.find(c => c.id === alert.countryId)?.name ?? alert.countryId}</td>
          <td>{alert.title}</td>
          <td><Badge text={alert.severity} /></td>
          <td>{alert.active ? 'Yes' : 'No'}</td>
          <td>{formatDateTime(alert.createdAt)}</td>
          <td>
            <Button size="sm" variant="danger" onclick={() => confirmDelete('alert', alert.id)}>Delete</Button>
          </td>
        </tr>
      {/each}
    </Table>
  {/if}
{/if}

<Modal bind:open={showCountryModal} title={editingCountry ? 'Edit Country' : 'Create Country'} onclose={() => (showCountryModal = false)}>
  <form onsubmit={(e) => { e.preventDefault(); handleSaveCountry(); }} class="space-y-4">
    <div>
      <label for="country-name" class="block text-sm font-medium mb-1">Name</label>
      <input id="country-name" type="text" bind:value={countryForm.name} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="country-code" class="block text-sm font-medium mb-1">Code</label>
      <input id="country-code" type="text" bind:value={countryForm.code} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="country-region" class="block text-sm font-medium mb-1">Region</label>
      <input id="country-region" type="text" bind:value={countryForm.region} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <Button type="submit">Save</Button>
  </form>
</Modal>

<Modal bind:open={showAlertModal} title="Create Health Alert" onclose={() => (showAlertModal = false)}>
  <form onsubmit={(e) => { e.preventDefault(); handleSaveAlert(); }} class="space-y-4">
    <div>
      <label for="alert-country" class="block text-sm font-medium mb-1">Country</label>
      <select id="alert-country" bind:value={alertForm.countryId} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required>
        <option value={0} disabled>Select a country</option>
        {#each countries as country}
          <option value={country.id}>{country.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="alert-title" class="block text-sm font-medium mb-1">Title</label>
      <input id="alert-title" type="text" bind:value={alertForm.title} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <div>
      <label for="alert-description" class="block text-sm font-medium mb-1">Description</label>
      <textarea id="alert-description" bind:value={alertForm.description} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" rows="4" required></textarea>
    </div>
    <div>
      <label for="alert-severity" class="block text-sm font-medium mb-1">Severity</label>
      <input id="alert-severity" type="text" bind:value={alertForm.severity} class="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading placeholder:text-border-light outline-none focus:border-accent transition-colors" required />
    </div>
    <Button type="submit">Save</Button>
  </form>
</Modal>

<ConfirmDialog
  open={showDeleteConfirm}
  title="Confirm Delete"
  message="Are you sure you want to delete this {deleteTarget.type}?"
  onconfirm={handleDelete}
  oncancel={() => (showDeleteConfirm = false)}
/>
