import { error } from '@sveltejs/kit';

type PortfolioImage = {
	alt: string;
	url: string;
};

type PortfolioItem = {
    id: number;
	slug: string;
	title: string;
	date: string;
	images: PortfolioImage[];
};

export async function load({ fetch }) {
	const apiUrl = import.meta.env.VITE_FLASK_APP_URL;

	try {
		const res = await fetch(`${apiUrl}/portfolios`);
		if (!res.ok) throw error(res.status, 'Failed to fetch portfolio items');

		const data: PortfolioItem[] = await res.json();

		return { portfolioItems: data };
	} catch (err) {
		console.error('Error fetching portfolio data:', err);
		throw error(500, 'Internal Server Error');
	}
}
