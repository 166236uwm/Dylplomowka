import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const getStatusText = (status) => {
    switch (status) {
      case 'ordered':
        return 'zamówiono';
      case 'saved':
        return 'do zamówienia';
      case 'booked':
        return 'w doręczeniu';
      case 'shipped':
        return 'zaksięgowana';
      default:
        return status;
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!delivery) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div className='showItems'>
      <h1>Szczegóły dostawy</h1>
      <p>Zapisana: {new Date(delivery.bookedAt).toLocaleString()}</p>
      <p>Status: {getStatusText(delivery.status)}</p>
      <h2>Dostarczone przedmioty</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Ilość</th>
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
        <button onClick={handleOrder}>Zamów</button>
      )}
      {delivery.status === 'ordered' && (
        <button onClick={handleMarkAsShipped}>Zaksięguj</button>
      )}
    </div>
  );
}

export default ViewDelivery;