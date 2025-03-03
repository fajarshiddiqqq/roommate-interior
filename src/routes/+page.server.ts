import { error } from '@sveltejs/kit';

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
}

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

export async function load({ fetch }) {
    const apiUrl = import.meta.env.VITE_FLASK_APP_URL;

    try {
        const res = await fetch(`${apiUrl}/portfolios?preview=true`);
        if (!res.ok) throw error(res.status, 'Failed to fetch portfolio items');

        const data: PortfolioItem[] = await res.json();

        return {portfolioItems: data};
    } catch (err) {
        console.error('Error fetching portfolio data:', err);
        throw error(500, 'Internal Server Error');
    }
}
