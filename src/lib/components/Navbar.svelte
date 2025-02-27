<script lang="ts">
	import { page } from '$app/stores';

	let isOpen = false;
</script>

<nav
	class="flex flex-col border-b border-gray-200 px-8 sm:flex-row sm:items-center sm:pb-0 {isOpen
		? 'pb-4'
		: 'pb-0'}"
>
	<div class="flex w-full items-center justify-between py-4">
		<!-- Logo -->
		<div class="text-2xl font-bold">Roommate Interior.</div>

		<!-- Action Button -->
		<button
			on:click={() => {
				isOpen = !isOpen;
			}}
			class="h-6 w-6 cursor-pointer sm:hidden"
		>
			<img src="/assets/{!isOpen ? 'burger' : 'close'}.svg" alt="burger" />
		</button>
	</div>

	<!-- Links -->
	<div
		class="rounded-lg border border-gray-200 bg-gray-100 p-4 px-3 sm:border-none sm:bg-transparent sm:p-0 {isOpen
			? 'block'
			: 'hidden sm:block'}"
	>
		<div class="flex flex-col sm:flex-row sm:items-center">
			<a
				href="/"
				class="rounded-md px-4 py-3 hover:relative hover:bg-gray-200/70 sm:py-2 sm:hover:bg-transparent sm:hover:before:absolute sm:hover:before:bottom-[2px] sm:hover:before:left-[50%] sm:hover:before:h-[2px] sm:hover:before:w-[50%] sm:hover:before:translate-x-[-50%] sm:hover:before:bg-[#ed7d2b] sm:hover:before:content-['']"
				class:current={$page.url.pathname === '/'}
			>
				Home
			</a>
			<a
				href="/portfolios"
				class="rounded-md px-4 py-3 hover:relative hover:bg-gray-200/70 sm:py-2 sm:hover:bg-transparent sm:hover:before:absolute sm:hover:before:bottom-[2px] sm:hover:before:left-[50%] sm:hover:before:h-[2px] sm:hover:before:w-[50%] sm:hover:before:translate-x-[-50%] sm:hover:before:bg-[#ed7d2b] sm:hover:before:content-['']"
				class:current={$page.url.pathname.startsWith('/portfolio')}
			>
				Portfolio
			</a>
			<a
				href="https://wa.me/+6281228659154?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20your%20services"
				class="rounded-md px-4 py-3 font-semibold text-nowrap hover:bg-gray-200/70 sm:rounded-full sm:bg-[#ED7D2B] sm:py-2 sm:text-white sm:hover:bg-[#ED7D2B]/90"
				target="_blank">Contact us</a
			>
		</div>
	</div>
</nav>

<style>
	@reference "tailwindcss/theme";

	.current {
		@apply relative bg-[#ED7D2B] text-white sm:bg-transparent sm:text-black;
	}

	.current::after {
		content: '';
		position: absolute;
		bottom: 2px;
		left: 50%;
		transform: translateX(-50%);
		width: 50%;
		height: 2px;
		background-color: #ed7d2b;
	}
</style>
