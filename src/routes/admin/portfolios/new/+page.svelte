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

	let title = $state('');
	let slug = $derived(
		title
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]/g, '')
	);
	let date = $state('');
	let location = $state('');
	let category = $state('');
	let client = $state('');
	let description = $state('');
	let tags = $state('');

	let images = $state<portfolioImage[]>([]);
	let thumbnailImage = $derived(images.find((img) => img.thumbnail));
	let nonThumbnailImages = $derived(images.filter((img) => !img.thumbnail));

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

	function setThumbnail(url: string) {
		images = images.map((img) => ({
			...img,
			thumbnail: img.url === url
		}));
	}

	function deleteImage(url: string) {
		images = images.filter((img) => img.url !== url);
		if (!images.some((img) => img.thumbnail) && images.length > 0) {
			images = images.map((img, index) => ({
				...img,
				thumbnail: index === 0
			}));
		}
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
		};
		fileInput.click();
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
				const tagList = tags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag !== '');
				formData.append('tags', JSON.stringify(tagList));
			}

			images.forEach((img, index) => {
				if (img.file) {
					formData.append(`image_${index}`, img.file);
					formData.append(`image_${index}_thumbnail`, img.thumbnail ? 'true' : 'false');
					formData.append(`image_${index}_alt`, img.alt || '');
				}
			});

			const apiUrl = import.meta.env.VITE_FLASK_APP_URL;
			const response = await axios.post(`${apiUrl}/portfolios`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`
				}
			});

			if (response.status === 201) {
				title = '';
				date = '';
				location = '';
				category = '';
				client = '';
				description = '';
				tags = '';
				images = [];

				alert('New portfolio added successfully');
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
		class="sticky top-6 mb-6 flex w-fit cursor-pointer items-center space-x-2"
		onclick={() => {
			window.history.back();
		}}
	>
		<img src="/assets/arrow-left.svg" alt="arrow-left" class="h-4 w-4" />
		<div class="text-lg font-bold">Back</div>
	</button>

	<!-- Form -->
	<form
		class="mx-auto grid max-w-5xl grid-cols-1 rounded-lg bg-white p-6 shadow-md sm:grid-cols-2"
		onsubmit={saveChanges}
	>
		<!-- General Section -->
		<h3 class="col-span-2 mb-2 block text-center text-2xl font-bold">General</h3>

		<!-- Title field -->
		<label class="m-2 block">
			<span class="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">Title</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border p-2"
				required
				bind:value={title}
			/>
		</label>

		<!-- Slug field -->
		<label class="m-2 block">
			<span class="text-gray-700">Slug</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border bg-gray-100 p-2 text-gray-500"
				disabled
				value={slug}
			/>
		</label>

		<!-- Date field -->
		<label class="m-2 block">
			<span class="text-gray-700 after:ml-1 after:text-red-500 after:content-['*']">Date</span>
			<input
				type="date"
				class="mt-1 block w-full rounded-md border p-2"
				required
				bind:value={date}
			/>
		</label>

		<!-- Location field -->
		<label class="m-2 block">
			<span class="text-gray-700">Location</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
				bind:value={location}
			/>
		</label>

		<!-- Category field -->
		<label class="m-2 block">
			<span class="text-gray-700">Category</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
				bind:value={category}
			/>
		</label>

		<!-- Client field -->
		<label class="m-2 block">
			<span class="text-gray-700">Client</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
				bind:value={client}
			/>
		</label>

		<!-- Description field -->
		<label class="col-span-2 m-2 block">
			<span class="text-gray-700">Description</span>
			<textarea
				class="mt-1 block h-24 w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
				bind:value={description}
			></textarea>
		</label>

		<!-- Tags field -->
		<label class="col-span-2 m-2 block">
			<span>Tags (comma-separated)</span>
			<input
				type="text"
				class="mt-1 block w-full rounded-md border p-2 placeholder-gray-400 focus:placeholder-transparent"
				placeholder="(optional)"
				bind:value={tags}
			/>
		</label>

		<!-- Image section -->
		<h3 class="col-span-2 mb-4 mt-6 block border-gray-200 text-center text-2xl font-bold">Image</h3>

		<!-- Image field -->
		<div class="col-span-2 grid grid-cols-4 gap-2">
			{#if thumbnailImage}
				<!-- Thumbnail -->
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

				<!-- Other images -->
				{#each nonThumbnailImages as image}
					<div class="group relative col-span-1">
						<img src={image.url} alt={image.alt} class="h-full w-full rounded-lg object-cover" />
						<!-- Button overlay -->
						<div
							class="absolute left-0 top-0 z-10 hidden h-full w-full flex-col
							justify-center gap-2 bg-black/20 px-12 group-hover:flex"
						>
							<button
								type="button"
								class="rounded-md bg-gray-600 px-3 py-2 text-xs text-white hover:bg-gray-500"
								onclick={() => setThumbnail(image.url)}>Set as thumbnail</button
							>
							<button
								type="button"
								class="rounded-md bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-400"
								onclick={() => deleteImage(image.url)}>Delete</button
							>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Image button -->
		<div class="col-span-2 mt-6">
			<button class="mr-1 rounded-md bg-gray-400/30 px-4 py-2" onclick={addImage} type="button">
				Add Image
			</button>
		</div>

		<!-- Save button -->
		<button
			class="col-span-2 mt-6 w-full rounded-md bg-blue-500 p-2 text-lg font-semibold text-white transition hover:bg-blue-600"
			type="submit"
		>
			Save
		</button>
	</form>
</div>
