<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>TMAG Support</title>
</svelte:head>

{@render children()}
