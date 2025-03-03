<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	type portfolioImage = {
		url: string;
		file?: File;
		thumbnail: boolean;
		alt: string;
	};

	const { data } = $props();
	let { portfolio } = data;
	let title = $state(portfolio.title);
	let date = $state(portfolio.date);
	let location = $state(portfolio.location);
	let category = $state(portfolio.category);
	let client = $state(portfolio.client);
	let description = $state(portfolio.description);
	let tags = $state(portfolio.tags && portfolio.tags.length > 0 ? portfolio.tags.join(', ') : '');
	let slug = $derived(
		title
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]/g, '')
	);

	const originalImages = portfolio.images;
	let images = $state([...portfolio.images]);
	let thumbnailImage = $derived(images.find((img) => img.thumbnail));
	let nonThumbnailImages = $derived(images.filter((img) => !img.thumbnail));
	let isChangeImage = $state(false);

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

	function addImage() {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.multiple = true;
		fileInput.onchange = async (event) => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			const newImages: portfolioImage[] = [];
			const needThumbnail = !images.some((img) => img.thumbnail);

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const tempUrl = URL.createObjectURL(file);
				const imageAlt = file.name.split('.')[0];

				const isThumbnail = i === 0 && needThumbnail;

				newImages.push({
					url: tempUrl,
					file: file,
					alt: imageAlt || '',
					thumbnail: isThumbnail
				});
			}
			images = [...images, ...newImages];
			isChangeImage = true;
		};

		fileInput.click();
	}

	function setThumbnail(url: string) {
		isChangeImage = true;
		images = images.map((img) => ({
			...img,
			thumbnail: img.url === url
		}));
	}

	function deleteImage(url: string) {
		if (images.length < 2) {
			alert('Cannot delete the only image');
			return;
		}
		isChangeImage = true;
		images = images.filter((img) => img.url !== url);
		if (!images.some((img) => img.thumbnail) && images.length > 0) {
			images = images.map((img, index) => ({
				...img,
				thumbnail: index === 0
			}));
		}
	}

	function revertChangeImage() {
		isChangeImage = false;
		images.forEach((img) => {
			if (img.isNewUpload && img.url.startsWith('blob:')) {
				URL.revokeObjectURL(img.url);
			}
		});
		images = [...originalImages];
	}

	async function saveChanges(event: Event) {
		event.preventDefault();
		if (!title || !date) {
			alert('Title and Date are required');
			return;
		}
		if (images.length === 0) {
			alert('At least 1 image is required');
			return;
		}

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('slug', slug);
			formData.append('date', date);
			if (location) formData.append('location', location);
			if (category) formData.append('category', category);
			if (client) formData.append('client', client);
			if (description) formData.append('description', description);
			if (tags) {
				const tagList = tags.replace(/\s+/g, '');
				formData.append('tags', tagList);
			}

			images.forEach((img, index) => {
				if (img.file) {
					formData.append(`image_${index}`, img.file);
					formData.append(`image_${index}_status`, 'new');
				}
				formData.append(`image_${index}_thumbnail`, img.thumbnail ? 'true' : 'false');
				formData.append(`image_${index}_alt`, img.alt || '');
				formData.append(`image_${index}_filename`, img.file_name || '');
				formData.append(`image_${index}_status`, 'old');
			});

			const apiUrl = import.meta.env.VITE_FLASK_APP_URL;
			const response = await axios.put(`${apiUrl}/portfolios/${portfolio.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`
				}
			});

			if (response.status === 200) {
				goto('/admin/portfolios');
			}
		} catch (error) {
			console.error('Error adding new portfolio:', error);

			if (axios.isAxiosError(error) && error.response) {
				console.error('Server Response:', error.response.data);
				alert(`${error.response.data.error}`);
			} else {
				alert('An unexpected error occurred');
			}
		}
	}
</script>

<!-- Container -->
<div class="w-full space-y-6 bg-gray-100 p-8">
	<!-- Back button -->
	<button
		onclick={() => window.history.back()}
		class="sticky top-6 mb-6 flex w-fit cursor-pointer items-center space-x-2"
	>
		<img src="/assets/arrow-left.svg" alt="arrow left" class="h-4 w-4" />
		<div class="text-lg font-bold">Back</div>
	</button>

	<!-- Form -->
	<form
		class="mx-auto grid max-w-5xl grid-cols-1 rounded-lg bg-white p-6 shadow-md sm:grid-cols-2"
		onsubmit={saveChanges}
	>
		<!-- General section -->
		<h3 class="col-span-2 mb-2 block text-center text-2xl font-bold">General</h3>

		<label class="m-2 block">
			<span class="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']"> Title</span>
			<input type="text" bind:value={title} class="mt-1 block w-full rounded-md border p-2" />
		</label>

		<label class="m-2 block">
			<span class="text-gray-700">Slug</span>
			<input
				type="text"
				value={slug}
				disabled
				class="mt-1 block w-full rounded-md border bg-gray-100 p-2 text-gray-500"
			/>
		</label>

		<label class="m-2 block">
			<span class="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">Date</span>
			<input type="date" bind:value={date} class="mt-1 block w-full rounded-md border p-2" />
		</label>

		<label class="m-2 block">
			<span class="text-gray-700">Location</span>
			<input
				type="text"
				bind:value={location}
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
			/>
		</label>

		<label class="m-2 block">
			<span class="text-gray-700">Category</span>
			<input
				type="text"
				bind:value={category}
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
			/>
		</label>

		<label class="m-2 block">
			<span class="text-gray-700">Client</span>
			<input
				type="text"
				bind:value={client}
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
			/>
		</label>

		<label class="col-span-2 m-2 block">
			<span class="text-gray-700">Description</span>
			<textarea
				bind:value={description}
				class="mt-1 block h-24 w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
			></textarea>
		</label>

		<label class="col-span-2 m-2 block">
			<span class="text-gray-700">Tags (comma-separated)</span>
			<input
				type="text"
				bind:value={tags}
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
			/>
		</label>

		<!-- Image section -->
		<h3 class="col-span-2 mb-4 mt-6 block border-gray-200 text-center text-2xl font-bold">
			Images
		</h3>

		<div class="col-span-2 grid grid-cols-4 gap-2">
			{#if images.length > 0 && thumbnailImage}
				<div class="group relative col-span-2 row-span-2">
					<img
						src={thumbnailImage.url}
						alt={thumbnailImage.alt}
						class="h-full w-full rounded-lg object-cover"
					/>
					<div
						class="absolute left-0 top-0 z-10 hidden h-full w-full flex-col justify-end bg-black/20 px-12 pb-10 hover:flex group-hover:flex"
					>
						<button
							type="button"
							class="rounded-md bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-400"
							onclick={() => deleteImage(thumbnailImage.url)}
						>
							Delete
						</button>
					</div>
				</div>

				{#each nonThumbnailImages as image}
					<div class="group relative col-span-1">
						<img
							src={image.url}
							alt={image.alt || 'Portfolio image'}
							class="h-full w-full rounded-lg object-cover"
						/>
						<div
							class="absolute left-0 top-0 z-10 hidden h-full w-full flex-col justify-center gap-2 bg-black/20 px-12 group-hover:flex"
						>
							<button
								class="rounded-md bg-gray-600 px-3 py-2 text-xs text-white hover:bg-gray-500"
								onclick={() => setThumbnail(image.url)}
								type="button"
							>
								Set as thumbnail
							</button>
							<button
								class="rounded-md bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-400"
								onclick={() => deleteImage(image.url)}
								type="button"
							>
								Delete
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="col-span-2 mt-6">
			<button class="mr-1 rounded-md bg-gray-400/30 px-4 py-2" onclick={addImage} type="button">
				Add Image
			</button>
			{#if isChangeImage}
				<button
					class="rounded-md bg-amber-500 px-4 py-2 text-white"
					onclick={revertChangeImage}
					type="button"
				>
					Revert Changes
				</button>
			{/if}
		</div>

		<!-- Save button -->
		<button
			class="col-span-2 mt-6 w-full rounded-md bg-blue-500 p-2 text-lg font-semibold text-white transition hover:bg-blue-600"
			type="submit"
		>
			Save Changes
		</button>
	</form>
</div>
