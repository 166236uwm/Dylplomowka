import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/auth';

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
    <div className='showItems'>
      <h1>Current Stock</h1>
      {error && <p className="error">{error}</p>}
      {itemsByLocation.map(({ locationId, locationName, items = [] }) => (
        <div key={locationId}>
          <h2>{locationName}</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Unit Size</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.currentStock}</td>
                    <td>{item.defaultUnitSize} {item.unit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No items available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default CurrentStock;
