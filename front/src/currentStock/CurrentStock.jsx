import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';

function CurrentStock({ user }) {
  const [itemsByLocation, setItemsByLocation] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const groupedItems = await apiRequest('Items/grouped-by-location', user.token, null, 'GET');
        setItemsByLocation(groupedItems);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };

    fetchItems();
  }, [user.token]);

  return (
    <div>
      <h1>Current Stock</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {itemsByLocation.map(({ locationId, locationName, items = [] }) => (
          <li key={locationId}>
            <h2>{locationName}</h2>
            <ul>
              {items.length > 0 ? (
                items.map(item => (
                  <li key={item.id}>
                    {item.name} - Current Stock: {item.currentStock}
                  </li>
                ))
              ) : (
                <li>No items available</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrentStock;
