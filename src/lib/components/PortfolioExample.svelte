<script lang="ts">
	type PortfolioImage = {
		thumbnail: boolean;
		file_name: string;
		url: string;
		alt: string;
	};

	type PortfolioVideo = {
		file_name: string;
		url: string;
		alt: string;
	};

	type PortfolioItem = {
		id: number;
		title: string;
		slug: string;
		description: string;
		location: string;
		date: string;
		client: string;
		category: string;
		tags: string[];
		images: PortfolioImage[];
		videos: PortfolioVideo[];
	};

	export let portfolioItems: PortfolioItem[] = [];
</script>

{#if portfolioItems.length === 0}
	<!-- Loading state -->
	<div class="flex min-h-screen items-center justify-center">
		<p>Loading...</p>
	</div>
{:else}
	<div class="mb-20 w-full p-8">
		<div class="container mx-auto flex max-w-7xl flex-col items-center justify-center space-y-6">
			<h3 class="text-3xl font-bold sm:text-4xl">Our Works</h3>
			<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
				{#each portfolioItems as item}
					<a
						href={`/portfolios/${item.slug}`}
						class="portfolio-item h-50 block w-full overflow-hidden rounded-xl transition-transform sm:min-h-72"
					>
						{#if item.images.length > 0}
							<img
								src={item.images.find((img) => img.thumbnail)?.url || item.images[0].url}
								alt={item.images.find((img) => img.thumbnail)?.alt || item.images[0].alt}
								class="h-full w-full rounded-xl object-cover"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
								No Image
							</div>
						{/if}
					</a>
				{/each}
				<div
					class="h-50 relative flex items-center justify-center overflow-hidden rounded-xl sm:min-h-72"
				>
					{#if portfolioItems.length > 0}
						<!-- Background Image -->
						<div
							class="absolute inset-0 bg-cover bg-center opacity-60 blur-md filter"
							style="background-image: url({portfolioItems[0].images.find((img) => img.thumbnail)
								?.url || portfolioItems[0].images[0]?.url});"
						></div>
					{/if}

					<!-- Foreground Button -->
					<a
						href="/portfolios"
						class="relative z-10 flex h-full w-full items-center justify-center text-nowrap rounded-xl bg-black/15 px-4 py-3 text-lg font-semibold text-white transition-transform hover:scale-110"
					>
						See more
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.portfolio-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.1s ease-in-out;
	}

	.portfolio-item:hover img {
		transform: scale(1.03);
	}
</style>
