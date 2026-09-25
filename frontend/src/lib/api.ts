const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5133';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('API isteği başarısız oldu');
  }

  // Empty responses (like 200 OK without body) shouldn't be parsed as JSON
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
