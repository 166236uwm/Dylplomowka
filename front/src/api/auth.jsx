const API_URL = 'http://localhost:5140/api';

export const unauthorisedWithBody = async (url, bodyParams) => {
  const response = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyParams),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return { data };
};

export const authorisedWithoutBody = async (url, token) => {
  const response = await fetch(`${API_URL}/${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
};

export const authorisedWithBody = async (url, bodyParams, token) => {
  const response = await fetch(`${API_URL}/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(bodyParams),
  });

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }

  return await response.json();
};

