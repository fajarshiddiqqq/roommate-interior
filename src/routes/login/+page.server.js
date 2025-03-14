import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const token = cookies.get('auth_token');
    if (token) {
        throw redirect(302, '/admin');
    }
}
