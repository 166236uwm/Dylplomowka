import { useEffect, useState } from 'react';
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
            Created At: {new Date(transaction.createdAt).toLocaleString()}
            <ul>
              {transaction.transactionItems.map(item => (
                <li key={item.itemId}>
                  Item Name: {item.item.name}, Amount: {item.amount}, Price: {item.price}
                </li>
              ))}
            </ul>
            Total Price: {transaction.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;