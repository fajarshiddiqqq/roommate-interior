<script>
    import { goto } from "$app/navigation";

</script>

<div class="flex w-full">
	<div class="border-b-2 border-gray-700 bg-gray-800 text-white">
		<div class="sticky top-0 flex flex-col">
			<div class="flex flex-col gap-4">
				<h1 class="text-nowrap p-6 text-3xl font-semibold">Admin Page</h1>
				<div class="flex flex-col">
					<a class="px-6 py-3 hover:bg-gray-600" href="/admin">Dashboard</a>
					<a class="px-6 py-3 hover:bg-gray-600" href="/admin/portfolios">Portfolios</a>
				</div>
			</div>
			<button
				class="mx-4 mt-6 rounded-full bg-red-600 px-6 py-2 text-center font-medium hover:bg-red-700 mb-6"
                on:click={() => {
                    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    goto('/login');
                }}
                >Logout</button
			>
		</div>
	</div>
	<slot />
</div>
