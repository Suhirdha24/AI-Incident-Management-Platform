const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim())
  ? process.env.NEXT_PUBLIC_API_URL.trim()
  : 'http://localhost:5000';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('opsai_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Abort controller for 8 second timeout to prevent infinite hanging UI
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data.data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Server connection timeout. Please ensure API backend is running on port 5000.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

