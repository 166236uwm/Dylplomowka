import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function TransactionDetails({ user }) {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');
  const [items, setItems] = useState({});
  const navigate = useNavigate();

  const fetchTransactionDetails = async () => {
    try {
      const fetchedTransaction = await apiRequest(`Transaction/${id}`, user.token, null, 'GET');
      setTransaction(fetchedTransaction);
      
      const itemPromises = fetchedTransaction.transactionItems.map(async (item) => {
        const fetchedItem = await apiRequest(`Items/${item.itemId}`, user.token, null, 'GET');
        return { ...item, ...fetchedItem };
      });
      
      const itemsData = await Promise.all(itemPromises);
      
      const itemsObject = itemsData.reduce((acc, item) => {
        acc[item.itemId] = item;
        return acc;
      }, {});
      setItems(itemsObject);

    } catch (err) {
      setError('Failed to fetch transaction details');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, [id, user.token]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!transaction) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h1>Szczegóły wysyłki</h1>
      <button onClick={() => navigate(-1)}>Wróć</button>
      <p>
        <strong>Zaksięgowana:</strong> {new Date(transaction.createdAt).toLocaleString()}
      </p>
      <h2>Przedmioty</h2>
      <table>
        <thead>
          <tr>
            <th>ID Przedmiotu</th>
            <th>Nazwa Przedmiotu</th>
            <th>Wielkość jednostki</th>
            <th>Ilość</th>
          </tr>
        </thead>
        <tbody>
          {transaction.transactionItems.map(item => {
            const itemDetails = items[item.itemId];
            return (
              <tr key={item.itemId}>
                <td>{item.itemId}</td>
                <td>{itemDetails?.name || 'Ładowanie...'}</td>
                <td>{itemDetails?.defaultUnitSize || 'Ładowanie...'}</td>
                <td>{item.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionDetails;
