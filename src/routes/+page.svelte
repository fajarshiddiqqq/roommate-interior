<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Advantage from '$lib/components/Advantage.svelte';
	import PortfolioExample from '$lib/components/PortfolioExample.svelte';
	import MapAddress from '$lib/components/MapAddress.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import GoTop from '$lib/components/GoTop.svelte';
	export let data;
</script>

<div class="flex w-full flex-col">
	<Hero />
	<About />
	<Advantage />
	<PortfolioExample portfolioItems={data.portfolioItems} />
	<Contact />
	<MapAddress />
	<GoTop />
</div>
