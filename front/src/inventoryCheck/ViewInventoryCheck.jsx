import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function ViewInventoryCheck({ user }) {
  const { id } = useParams();
  const [inventoryCheck, setInventoryCheck] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventoryCheck = async () => {
      try {
        const data = await apiRequest(`InventoryCheck/${id}`, user.token, null, 'GET');
        setInventoryCheck(data);
      } catch (err) {
        setError('Failed to fetch inventory check');
        console.error(err);
      }
    };

    fetchInventoryCheck();
  }, [id, user.token]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!inventoryCheck) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Inventory Check Details</h1>
      <p>Checked At: {new Date(inventoryCheck.checkedAt).toLocaleString()}</p>
      <ul>
        {inventoryCheck.inventoryCheckItems.map(item => (
          <li key={item.itemId}>
            Item ID: {item.itemId}, Recorded Amount: {item.recordedAmount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewInventoryCheck;