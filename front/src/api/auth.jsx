const API_URL = 'http://localhost:5140/api';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/User/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};
