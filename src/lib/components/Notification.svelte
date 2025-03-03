<script lang="ts">
	import { onMount } from 'svelte';

	export let message: string = '';
	export let type: 'success' | 'error' = 'success';
	export let duration: number = 3000;
	export let onClose: () => void;
	export let index: number = 0;

	let progress = 100;
	let visible = true;
	let interval: NodeJS.Timeout;

	onMount(() => {
		interval = setInterval(() => {
			progress -= 100 / (duration / 100);
			if (progress <= 0) {
				clearInterval(interval);
				closeNotification();
			}
		}, 100);
	});

	function closeNotification() {
		visible = false;
		clearInterval(interval);
		setTimeout(onClose, 300);
	}
</script>

{#if visible}
	<div
		class="fixed right-4 z-50 w-auto max-w-[90vw] overflow-hidden rounded-lg shadow-lg transition-opacity duration-300"
		class:opacity-100={visible}
		class:opacity-0={!visible}
		class:bg-green-600={type === 'success'}
		class:bg-red-600={type === 'error'}
		style="top: {index * 60 + 16}px;"
	>
		<div class="flex w-full items-center justify-between py-2">
			<p class="whitespace-nowrap text-white px-4">{message}</p>
			<button
				on:click={closeNotification}
				class="mx-4 flex-shrink-0 text-white hover:text-gray-200 text-xl"
			>
				&times;
			</button>
		</div>

		<!-- Progress Bar -->
		<div class="h-1 bg-white transition-all duration-100" style="width: {progress}%;"></div>
	</div>
{/if}
