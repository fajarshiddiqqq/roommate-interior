export async function load({ params, fetch }) {
	const res = await fetch(`http://127.0.0.1:5000/portfolios/${params.slug}`);

	if (!res.ok) {
		return { status: res.status, error: new Error('Portfolio not found') };
	}

	const portfolio = await res.json();

	return {
		portfolio
	};
}
