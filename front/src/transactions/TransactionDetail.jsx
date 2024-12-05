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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Transaction Details</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <p>
        <strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Total Price:</strong> ${transaction.totalPrice.toFixed(2)}
      </p>
      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Unit Size</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {transaction.transactionItems.map(item => {
            const itemDetails = items[item.itemId];
            return (
              <tr key={item.itemId}>
                <td>{item.itemId}</td>
                <td>{itemDetails?.name || 'Loading...'}</td>
                <td>{itemDetails?.defaultUnitSize || 'Loading...'}</td>
                <td>{item.amount}</td>
                <td>${itemDetails?.price.toFixed(2) || 'Loading...'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionDetails;
