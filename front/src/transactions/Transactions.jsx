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
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <p>
              <strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Username:</strong> {transaction.username}
            </p>
            <p>
              <strong>Total Price:</strong> ${transaction.totalPrice.toFixed(2)}
            </p>
            <button onClick={() => navigate(`/transaction/${transaction.id}`)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
