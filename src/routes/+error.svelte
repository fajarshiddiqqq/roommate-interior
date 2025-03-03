<script lang="ts">
	import { page } from '$app/state';

	let status = page.status;
	let message = page.error.message;
</script>

<div class="flex flex-col w-full items-center justify-center bg-gray-100">
	<div class="rounded-lg bg-white p-6 text-center shadow-xl">
		<h1 class="mb-2 text-3xl font-bold">{status}</h1>
		<h3 class="text-xl">{message}</h3>
	</div>
    <a href="/" class="mt-1 rounded-lg px-3 py-2 text-blue-500 underline">/home</a>
</div>
