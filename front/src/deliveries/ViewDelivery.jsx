import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function ViewDelivery({ user }) {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const data = await apiRequest(`Delivery/${id}`, user.token, null, 'GET');
        setDelivery(data);
      } catch (err) {
        setError('Failed to fetch delivery');
        console.error(err);
      }
    };

    fetchDelivery();
  }, [id, user.token]);

  const handleMarkAsShipped = async () => {
    try {
      await apiRequest(`Delivery/${id}/ship`, user.token, null, 'POST');
      setDelivery({ ...delivery, status: 'shipped' });
    } catch (err) {
      setError('Failed to mark delivery as shipped');
      console.error(err);
    }
  };

  const handleOrder = async () => {
    try {
      await apiRequest(`Delivery/${id}/book`, user.token, null, 'POST');
      setDelivery({ ...delivery, status: 'ordered' });
    } catch (err) {
      setError('Failed to place order');
      console.error(err);
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!delivery) {
    return <p>Loading...</p>;
  }

  return (
    <div className='showItems'>
      <h1>Delivery Details</h1>
      <p>Saved At: {new Date(delivery.bookedAt).toLocaleString()}</p>
      <p>Status: {delivery.status}</p>
      <h2>Delivered Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {delivery.deliveredItems.map(item => (
            <tr key={item.itemId}>
              <td>{item.item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {delivery.status === 'saved' && (
        <button onClick={handleOrder}>Place as order</button>
      )}
      {delivery.status === 'ordered' && (
        <button onClick={handleMarkAsShipped}>Mark as Shipped</button>
      )}
    </div>
  );
}

export default ViewDelivery;