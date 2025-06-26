// Fetch wrapper to include JWT token
export const authFetch = async (url, method = 'GET', body = null, token) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) throw new Error(`${method} failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(`authFetch ${method} error:`, error);
    throw error;
  }
};