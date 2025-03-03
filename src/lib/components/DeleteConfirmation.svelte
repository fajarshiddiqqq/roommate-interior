<script lang="ts">
	export let onConfirm: () => void;
	export let onCancel: () => void;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={onCancel}>
	<div class="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg -translate-y-20" on:click|stopPropagation>
		<h2 class="text-lg font-semibold text-gray-700">Confirm Deletion</h2>
		<p class="mt-2 text-gray-500">
			Are you sure you want to delete this item? This action cannot be undone.
		</p>

		<div class="mt-6 flex justify-end gap-3">
			<button
				on:click={onConfirm}
				class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500 cursor-pointer"
			>
				Delete
			</button>
			<button
				on:click={onCancel}
				class="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
			>
				Cancel
			</button>
		</div>
	</div>
</div>
