<script>
	import { onMount } from 'svelte';

	let showButton = false;

	const handleScroll = () => {
		showButton = window.scrollY > 100;
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<button
	on:click={scrollToTop}
	class="fixed bottom-4 right-4 z-20 animate-bounce cursor-pointer rounded-full bg-[#ED7D2B] p-3 text-white shadow-lg transition-transform duration-300 ease-in-out hover:bg-[#ED7D2B]/90"
	class:hidden={!showButton}
>
	<img src="/assets/arrow-left.svg" alt="Go Top" class="h-4 w-4 rotate-90" />
</button>
