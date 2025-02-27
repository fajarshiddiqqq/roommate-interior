<script lang="ts">
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let activeIndex = writable<number>(0);

	const sections = [
		{
			title: 'High Quality Materials',
			content:
				'We use premium, durable, and stylish materials to ensure a long-lasting and aesthetically pleasing interior. Every material is carefully selected to match your vision and budget.',
			color: '#F87171',
			url: '/assets/advantage-1.jpg'
		},
		{
			title: 'Free 3D Design',
			content:
				'Visualize your space before making any decisions! We provide a <strong>free 3D design</strong> during the consultation process, allowing you to see the final look before construction begins.',
			color: '#60A5FA',
			url: '/assets/advantage-2.jpg'
		},
		{
			title: 'Qualified Builder Team',
			content:
				'Our experienced and professional builders ensure precision and quality in every project. With attention to detail, we bring your ideas to life while maintaining efficiency and reliability.',
			color: '#34D399',
			url: '/assets/advantage-3.jpg'
		},
		{
			title: 'Open Consultation',
			content:
				'We believe in transparency and open communication. Our team is always ready to discuss your needs, offer suggestions, and work within your budget to create the perfect space.',
			color: '#FBBF24',
			url: '/assets/advantage-4.jpg'
		}
	];
	let bgColor = writable(sections[0].color);

	function toggleAccordion(index: number) {
		activeIndex.update((current) => {
			if (current === index) {
				// If the current accordion is clicked again, do nothing
				return current;
			} else {
				bgColor.set(sections[index].color);
				return index;
			}
		});
	}
</script>

<div id="advantage" class="mb-16 w-full rounded-lg bg-gray-100 p-8 pb-12">
	<h2 class="mb-8 text-center text-3xl font-bold sm:text-4xl">Why Us?</h2>

	<div class="container mx-auto flex max-w-6xl flex-col items-stretch gap-6 sm:flex-row">
		<!-- Left Side: Color Box -->
		<div class="relative h-auto min-h-48 w-full rounded-lg transition-all duration-500 sm:w-1/3">
			<img
				src={sections[$activeIndex].url}
				alt={sections[$activeIndex].title}
				class="absolute inset-0 h-full w-full rounded-lg object-cover object-center"
			/>
		</div>

		<!-- Right Side: Accordion -->
		<div class="w-full space-y-4 sm:w-2/3">
			{#each sections as section, index}
				<div class="border-b border-gray-300 pb-2">
					<button
						class="flex w-full items-center justify-between py-2 text-left font-medium"
						on:click={() => toggleAccordion(index)}
					>
						<span class="text-lg sm:text-2xl">{section.title}</span>
						<span class="text-xl sm:text-3xl">{$activeIndex === index ? '−' : '+'}</span>
					</button>

					{#if $activeIndex === index}
						<!-- Open with fly-in transition, close instantly -->
						<div
							class="my-2 overflow-hidden text-gray-600 transition-all duration-300"
							in:fly={{ y: 10, duration: 300 }}
						>
							{@html section.content}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
