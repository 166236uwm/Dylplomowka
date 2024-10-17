const API_URL = 'http://localhost:5140/api';

export const apiRequest = async (url, token = null, bodyParams = null, method = 'GET') => {
  const headers = {
    'Content-Type': bodyParams ? 'application/json' : 'text/plain',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(`${API_URL}/${url}`, {
    method: method,
    headers: headers,
    body: bodyParams ? JSON.stringify(bodyParams) : null,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return await response.json();
};