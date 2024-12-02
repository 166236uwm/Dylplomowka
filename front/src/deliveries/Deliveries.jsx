import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function Deliveries({ user }) {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      const fetchedDeliveries = await apiRequest('Delivery', user.token, null, 'GET');
      setDeliveries(fetchedDeliveries);
    } catch (err) {
      setError('Failed to fetch deliveries');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [user.token]);

  const handleNewDelivery = () => {
    navigate('/deliveries/new');
  };

  const handleMarkAsShipped = async (id) => {
    try {
      await apiRequest(`Delivery/${id}/ship`, user.token, null, 'POST');
      fetchDeliveries();
    } catch (err) {
      setError('Failed to mark delivery as shipped');
      console.error(err);
    }
  };

  const savedDeliveries = deliveries.filter(delivery => delivery.status === 'saved');
  const orderedDeliveries = deliveries.filter(delivery => delivery.status === 'ordered');
  const shippedDeliveries = deliveries.filter(delivery => delivery.status === 'shipped');

  return (
    <div>
      <h1>Deliveries</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={handleNewDelivery}>New Delivery</button>
      <h2>Saved Deliveries</h2>
      <ul>
        {savedDeliveries.map(delivery => (
          <li key={delivery.id}>
            Booked At: {new Date(delivery.bookedAt).toLocaleString()}
            <button onClick={() => navigate(`/deliveries/${delivery.id}`)}>View</button>
          </li>
        ))}
      </ul>
      <h2>Ordered Deliveries</h2>
      <ul>
        {orderedDeliveries.map(delivery => (
          <li key={delivery.id}>
            Booked At: {new Date(delivery.bookedAt).toLocaleString()}
            <button onClick={() => navigate(`/deliveries/${delivery.id}`)}>View</button>
            <button onClick={() => handleMarkAsShipped(delivery.id)}>Mark as Shipped</button>
          </li>
        ))}
      </ul>
      <h2>Shipped Deliveries</h2>
      <ul>
        {shippedDeliveries.map(delivery => (
          <li key={delivery.id}>
            Delivered At: {new Date(delivery.deliveredAt).toLocaleString()}
            <button onClick={() => navigate(`/deliveries/${delivery.id}`)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Deliveries;