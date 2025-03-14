<script lang="ts">
	export let data;
	let { portfolio } = data;

	// Default selected media (first image/video)
	let selectedMedia =
		portfolio.images.length > 0
			? portfolio.images.find((image) => image.thumbnail) || portfolio.images[0]
				: null;

	// Modal state
	let showModal = false;

	// Functions to toggle modal
	function openModal() {
		if (selectedMedia.url.endsWith('.mp4')) {
			const videoElement = document.querySelector('.selected-video');
			if (videoElement) {
				videoElement.pause();
			}
		}
		showModal = true;
	}
	function closeModal() {
		showModal = false;
	}

	// Function to change selected media
	function selectMedia(media) {
		selectedMedia = media;
	}

	function goBack() {
		window.history.back();
	}
</script>

<!-- Container -->
<div class="mx-auto flex max-w-7xl flex-col gap-12 p-8 md:flex-row">
	<!-- Left Section -->
	<div class="md:w-1/2">
		<button on:click={goBack} class="mb-6 flex w-fit items-center space-x-2 cursor-pointer">
			<img src="/assets/arrow-left.svg" alt="arrow left" class="h-4 w-4" />
			<div class="text-lg font-bold">Back</div>
		</button>

		<h3 class="mb-6 text-5xl font-semibold">{portfolio.title}</h3>
		<p class="text-lg font-light text-gray-500">
			<strong>Category:</strong>
			{portfolio.category || 'N/A'}
		</p>
		<p class="text-lg font-light text-gray-500"><strong>Date:</strong> {portfolio.date}</p>
		<p class="text-lg font-light text-gray-500">
			<strong>Location:</strong>
			{portfolio.location || 'N/A'}
		</p>
		<p class="mt-3 text-lg">{portfolio.description || 'No description available.'}</p>

		<!-- Tags -->
		<div class="mt-6 flex flex-wrap gap-2">
			{#each portfolio.tags as tag}
				<span class="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800">#{tag}</span>
			{/each}
		</div>
	</div>

	<!-- Right Section -->
	<div class="p-4 px-6 md:w-1/2">
		<!-- Selected Media (Click to Open Modal) -->
		<div class="relative items-center justify-center">
			{#if selectedMedia}
				{#if selectedMedia.url.endsWith('.mp4')}
					<video class="max-h-[60vh] cursor-pointer rounded-md object-contain" controls>
						<source src={selectedMedia.url} type="video/mp4" />
						<track kind="captions" />
						Your browser does not support the video tag.
					</video>
				{:else}
					<button on:click={openModal}>
						<img
							class="max-h-[60vh] cursor-pointer rounded-md object-contain"
							src={selectedMedia.url}
							alt={selectedMedia.alt}
						/>
					</button>
				{/if}
			{/if}
		</div>

		<!-- Thumbnails -->
		<div class="mt-4 flex gap-2 overflow-x-auto">
			{#each portfolio.images as image}
				<button on:click={() => selectMedia(image)}>
					<img
						class="h-20 w-20 cursor-pointer rounded-md border-2 object-cover transition duration-200 {selectedMedia ===
						image
							? 'border-gray-500'
							: 'border-transparent'}"
						src={image.url}
						alt={image.alt}
					/>
				</button>
			{/each}

			{#each portfolio.videos as video}
				<video
					class="h-20 w-20 cursor-pointer rounded-md border-2 object-cover transition duration-200 {selectedMedia ===
					video
						? 'border-gray-500'
						: 'border-transparent'}"
					on:click={() => selectMedia(video)}
				>
					<track kind="captions" />
					<source src={video.url} type="video/mp4" />
				</video>
			{/each}
		</div>
	</div>
</div>

<!-- Modal for Full-Screen Media -->
{#if showModal}
	<button
		class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/70 bg-opacity-80"
		on:click={closeModal}
	>
		<div
			class="relative flex w-fit max-w-4xl items-center justify-center"
			on:click|stopPropagation
			aria-hidden="true"
		>
			{#if selectedMedia.url.endsWith('.mp4')}
				<video class="max-h-[80vh] w-fit object-contain" controls>
					<source src={selectedMedia.url} type="video/mp4" />
					<track kind="captions" />
					Your browser does not support the video tag.
				</video>
			{:else}
				<img
					class="max-h-[80vh] w-fit object-contain"
					src={selectedMedia.url}
					alt={selectedMedia.alt}
				/>
			{/if}
		</div>
	</button>
{/if}
