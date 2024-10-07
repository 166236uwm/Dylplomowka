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

  const data = await response.json();
  return { username, role: data.role, token: data.token };
};
export const fetchUsers = async (token) => {
  console.log(token);
  const response = await fetch(`${API_URL}/User`, {
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