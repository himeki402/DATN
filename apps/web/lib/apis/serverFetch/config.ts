import { cookies } from 'next/headers';

export async function serverFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('accessToken');
  
  const headers = new Headers(options.headers || {});
  if (authCookie) {
    headers.append('Cookie', `accessToken=${authCookie.value}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}
