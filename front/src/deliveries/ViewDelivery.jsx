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

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!delivery) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Delivery Details</h1>
      <p>Booked At: {new Date(delivery.bookedAt).toLocaleString()}</p>
      <p>Status: {delivery.status}</p>
      <ul>
        {delivery.deliveredItems.map(item => (
          <li key={item.itemId}>
            Item Name: {item.item.name}, Amount: {item.amount}
          </li>
        ))}
      </ul>
      {delivery.status === 'ordered' && (
        <button onClick={handleMarkAsShipped}>Mark as Shipped</button>
      )}
    </div>
  );
}

export default ViewDelivery;