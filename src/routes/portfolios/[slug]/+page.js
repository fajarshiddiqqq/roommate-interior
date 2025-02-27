export async function load({ params, fetch }) {
	const apiUrl = import.meta.env.VITE_FLASK_APP_URL;
	const res = await fetch(`${apiUrl}/portfolios/${params.slug}`);

	if (!res.ok) {
		return { status: res.status, error: new Error('Portfolio not found') };
	}

	const portfolio = await res.json();

	return {
		portfolio
	};
}
