import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const fetchedTransactions = await apiRequest('Transaction', user.token, null, 'GET');
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user.token]);

  return (
    <div>
      <h1>Transactions</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Created At</th>
            <th>Username</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.createdAt).toLocaleString()}</td>
              <td>{transaction.username}</td>
              <td>${transaction.totalPrice.toFixed(2)}</td>
              <td>
                <button onClick={() => navigate(`/transaction/${transaction.id}`)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
