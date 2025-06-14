import { useAuth } from "../contexts/AuthContext";

// Fetch wrapper to include JWT token
export const authFetch = async (url, method = 'GET', body = null, token) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }

  return await res.json();
};
