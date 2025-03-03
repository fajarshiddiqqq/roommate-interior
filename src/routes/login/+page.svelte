<script lang="ts">
    import { goto } from '$app/navigation';
    import axios from 'axios';

    let formData = $state({
        email: '',
        password: ''
    });

    let isLoading = $state(false);
    let error = $state<string | null>(null);

    async function handleSubmit(event: Event) {
        event.preventDefault();

        error = null;
        isLoading = true;

        const formDataSnapshot = $state.snapshot(formData);
        const apiUrl = import.meta.env.VITE_FLASK_APP_URL;

        try {
            const response = await axios.post(
                `${apiUrl}/login`,
                {
                    email: formDataSnapshot.email,
                    password: formDataSnapshot.password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const token = response.data.data;
            if (token) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 1);
                document.cookie = `auth_token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict${
                    window.location.protocol === 'https:' ? '; Secure' : ''
                }`;

                goto('/admin');
            }
        } catch (err) {
            console.error('Login failed:', err);
            if (axios.isAxiosError(err)) {
                error = err.response?.data?.message || 'Login failed. Please try again.';
            } else {
                error = 'An unexpected error occurred. Please try again.';
            }
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="flex w-full items-center justify-center bg-gray-100">
    <form class="bg-white p-12 py-8 shadow-xl" onsubmit={handleSubmit} autocomplete="on">
        <h2 class="mb-4 text-2xl font-bold">Admin area</h2>

        <div class="mb-3 flex flex-col space-y-2">
            <label for="email" class="text-sm text-gray-600">Email Address</label>
            <input
                id="email"
                type="email"
                placeholder="Email"
                class="rounded-lg border-2 border-gray-500 px-4 py-3"
                required
                bind:value={formData.email}
                autocomplete="username"
            />
        </div>

        <div class="mb-3 flex flex-col space-y-2">
            <label for="password" class="text-sm text-gray-600">Password</label>
            <input
                id="password"
                type="password"
                placeholder="Password"
                class="rounded-lg border-2 border-gray-500 px-4 py-3"
                required
                bind:value={formData.password}
                autocomplete="current-password"
            />
        </div>

        {#if error}
            <div class="mt-2 text-sm text-red-600">
                {error}
            </div>
        {/if}

        <button
            class="mt-4 w-full rounded-full bg-[#ED7D2B] p-3 text-center font-semibold text-white hover:bg-[#ED7D2B]/90 active:bg-[#ED7D2B]/80"
            type="submit"
            disabled={isLoading}
        >
            {isLoading ? 'Logging in...' : 'Login'}
        </button>
    </form>
</div>
