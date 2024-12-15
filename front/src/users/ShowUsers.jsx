import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';
import './ShowUsers.css';

function ShowUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await apiRequest("User", user.token, null, 'GET');
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
      const data = await apiRequest(`User/${id}/role`, user.token, newRole, 'PUT');
      console.log(data);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    console.log(`Deleting user ${id}`);
    try {
      await apiRequest(`User/${id}`, user.token, null, 'DELETE');
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>Lista Użytkowników</h1>
      <button onClick={handleAddUser}>Dodaj użytkownika</button>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">Filtruj według roli</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="User">Użytkownik</option>
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
              <option value="User">Użytkownik</option>
            </select>
            <button onClick={() => handleDeleteUser(user.id)}>Usuń</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowUsers;