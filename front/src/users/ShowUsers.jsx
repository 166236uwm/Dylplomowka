import { useEffect, useState } from 'react';
import { fetchUsers } from '../api/auth';

function ShowUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers(user.token);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [user.token]);

  const filteredUsers = users.filter(user => user.role.includes(filter));

  return (
    <div>
      <h1>Users List</h1>
      <input
        type="text"
        placeholder="Filter by role"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowUsers;