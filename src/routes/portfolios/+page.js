export async function load({ fetch }) {
	const apiUrl = import.meta.env.VITE_FLASK_APP_URL;

	let portfolioItems = [];
	try {
		const res = await fetch(`${apiUrl}/portfolios`);
		if (!res.ok) throw new Error('Failed to fetch');

		const data = await res.json();

		portfolioItems = data.map((item) => ({
			slug: item.slug,
			image: item.images.length > 0 ? item.images[0].url : '/assets/placeholder.jpg', // Fallback image
			title: item.title
		}));
	} catch (error) {
		console.error('Error fetching portfolio data:', error);
	}

	return {
		portfolioItems
	};
}
