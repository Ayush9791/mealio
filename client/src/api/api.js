const runtimeEnvBase = import.meta.env.VITE_API_URL;

const resolveApiBaseUrl = () => {
  if (runtimeEnvBase) return runtimeEnvBase;

  if (import.meta.env.DEV) {
    // Vite proxy target (see client/vite.config.js)
    return '/api';
  }

  // Production fallback when no env is provided.
  // If frontend and backend are deployed separately, set VITE_API_URL.
  return '/api';
};

const API_BASE_URL = resolveApiBaseUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('mealio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Request failed (${response.status})`);
    }
    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Unable to connect to API at ${API_BASE_URL}. Ensure backend is running and VITE_API_URL is correct.`,
      );
    }
    throw error;
  }
};

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  createListing: (body) => request('/listing', { method: 'POST', body: JSON.stringify(body) }),
  getListings: () => request('/listings'),
  acceptListing: (body) => request('/accept-listing', { method: 'POST', body: JSON.stringify(body) }),
  completeListing: (body) => request('/listing/complete', { method: 'POST', body: JSON.stringify(body) }),
};

export default api;
