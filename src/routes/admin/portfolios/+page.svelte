<script lang="ts">
	import type { PageData } from './$types';
	import DeleteConfirmation from '$lib/components/DeleteConfirmation.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';

	type PortfolioImage = { alt: string; url: string };
	type PortfolioItem = {
		id: number;
		slug: string;
		title: string;
		date: string;
		images: PortfolioImage[];
	};

	export let data: PageData;
	let { portfolioItems } = data;
	let groupedItems = groupByMonthYear(portfolioItems);

	let showConfirm = false;
	let selectedId: number | null = null;
	let notifications: { id: number; message: string; type: 'success' | 'error' }[] = [];

	let authToken: any;

	onMount(() => {
		authToken = getAuthToken();
	});

	function getAuthToken() {
		if (typeof document === 'undefined') return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; auth_token=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	}

	async function showNotification(message: string, type: 'success' | 'error' = 'success') {
		const id = Date.now();
		notifications = [...notifications, { id, message, type }];
		await tick();
		setTimeout(async () => {
			notifications = notifications.filter((n) => n.id !== id);
			await tick();
		}, 3000);
	}

	function groupByMonthYear(items: PortfolioItem[]): [string, PortfolioItem[]][] {
		const grouped: Record<string, PortfolioItem[]> = {};

		items.forEach((item) => {
			const date = new Date(item.date);
			const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

			if (!grouped[monthYear]) grouped[monthYear] = [];
			grouped[monthYear].push(item);
		});

		return Object.entries(grouped).sort(
			(a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
		);
	}

	function confirmDelete(event: Event, id: number) {
		event.preventDefault();
		event.stopPropagation();
		selectedId = id;
		showConfirm = true;
	}

	async function deletePortfolio() {
		const apiUrl = import.meta.env.VITE_FLASK_APP_URL;
		try {
			await axios.delete(`${apiUrl}/portfolios/${selectedId}`, {
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});

			portfolioItems = portfolioItems.filter((item) => item.id !== selectedId);
			groupedItems = groupByMonthYear([...portfolioItems]);

			showNotification('Portfolio deleted successfully!', 'success');
		} catch (error) {
			showNotification('Failed to delete portfolio', 'error');
		}

		showConfirm = false;
		selectedId = null;
	}
</script>

<div class="w-full p-8">
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-3xl font-bold text-black">Manage Projects</h1>
		<a
			href="/admin/portfolios/new"
			class="cursor-pointer text-nowrap rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
		>
			+ New Portfolio
		</a>
	</div>

	{#each groupedItems as [monthYear, items]}
		<div class="mb-12">
			<h3 class="mb-4 text-xl font-medium text-gray-500">{monthYear}</h3>
			<div
				class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
			>
				{#each items as item}
					<div class="group relative block bg-white">
						<div class="relative overflow-hidden rounded-lg">
							<div class="absolute right-2 top-2 flex items-center justify-between gap-2">
								<a
									href="/admin/portfolios/{item.slug}"
									class=" hidden rounded-full bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-400 group-hover:block"
									>Edit</a
								>
								<button
									on:click={(event) => confirmDelete(event, item.id)}
									class=" hidden rounded-full bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-400 group-hover:block"
								>
									Delete
								</button>
							</div>

							<img
								src={item.images.find((img: any) => img.thumbnail)?.url}
								alt={item.images.find((img: any) => img.thumbnail)?.alt}
								class="h-[300px] w-full object-cover"
							/>
						</div>
						<div class="flex items-end justify-between">
							<h4 class="text-md mt-2 font-semibold text-gray-500">{item.title}</h4>
							<p class="text-sm text-gray-400">{item.date}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

{#if showConfirm}
	<DeleteConfirmation onConfirm={deletePortfolio} onCancel={() => (showConfirm = false)} />
{/if}

<!-- Render Multiple Notifications -->
{#each notifications as notification, i (notification.id)}
	<Notification
		message={notification.message}
		type={notification.type}
		index={i}
		onClose={() => (notifications = notifications.filter((n) => n.id !== notification.id))}
	/>
{/each}
