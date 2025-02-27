<script>
	let portfolioItems = [];

	// Fetch portfolio items from backend
	async function fetchPortfolioItems() {
		try {
			const res = await fetch('http://127.0.0.1:5000/portfolios-preview');
			if (!res.ok) throw new Error('Failed to fetch');

			const data = await res.json();

			// Map the fetched data into the expected format
			portfolioItems = data.map((item) => ({
				slug: item.slug,
				image: item.images.length > 0 ? item.images[0].url : null,
				title: item.title
			}));
		} catch (error) {
			console.error('Error fetching portfolio data:', error);
		}
	}

	// Fetch items when component mounts
	fetchPortfolioItems();
</script>

<div class="mb-20 w-full p-8">
	<div class="container mx-auto flex max-w-7xl flex-col items-center justify-center space-y-6">
		<h3 class="text-3xl font-bold sm:text-4xl">Our Works</h3>
		<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
			{#each portfolioItems as item}
				<a
					href={`/portfolios/${item.slug}`}
					class="portfolio-item h-50 w-full rounded-xl transition-transform hover:scale-102 sm:min-h-72"
				>
					{#if item.image}
						<img src={item.image} alt={item.title} class="h-full w-full rounded-xl object-cover" />
					{:else}
						<div class="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
							No Image
						</div>
					{/if}
				</a>
			{/each}
			<div class="flex h-50 items-center justify-center sm:min-h-72 relative overflow-hidden rounded-xl">
				{#if portfolioItems.length > 0}
					<!-- Background Image -->
					<div
						class="absolute inset-0 bg-cover bg-center filter blur-md opacity-60"
						style="background-image: url({portfolioItems[0].image});"
					></div>
				{/if}
			
				<!-- Foreground Button -->
				<a
					href="/portfolios"
					class="relative z-10 flex h-full w-full items-center justify-center rounded-xl  px-4 py-3 font-semibold text-nowrap text-lg transition-transform hover:scale-110 text-white bg-black/20"
				>
					See more
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.portfolio-item {
		display: block;
		width: 100%;
		overflow: hidden;
	}

	.portfolio-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease-in-out;
	}

	.portfolio-item:hover img {
		transform: scale(1.02);
	}
</style>
