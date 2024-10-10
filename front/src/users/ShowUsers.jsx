import { useEffect, useState } from 'react';
import { authorisedWithoutBody, authorisedWithBody } from '../api/auth';
import './ShowUsers.css';

function ShowUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await authorisedWithoutBody("User", user.token);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [user.token]);

  const filteredUsers = users.filter(user => user.role.includes(filter));
  const handleRoleChange = async (id, newRole) => {
    console.log(`Updating role for user ${id} to ${newRole}`);
    try {
      const data = await authorisedWithBody(`User/${id}/role`, `${newRole}`, user.token);
      console.log(data);
      // Update the users state with the new role
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Users List</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">Filter by role</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="User">User</option>
      </select>
      <div id="users-list">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            {user.username} - 
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowUsers;