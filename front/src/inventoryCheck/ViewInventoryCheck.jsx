import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function ViewInventoryCheck({ user }) {
  const { id } = useParams();
  const [inventoryCheck, setInventoryCheck] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

    const fetchItems = async () => {
      try {
        const fetchedItems = await apiRequest('Items', user.token, null, 'GET');
        setItems(fetchedItems);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };

    fetchInventoryCheck();
    fetchItems();
  }, [id, user.token]);

  const handleAmountChange = (itemId, amount) => {
    setInventoryCheck(prev => ({
      ...prev,
      inventoryCheckItems: prev.inventoryCheckItems.map(item =>
        item.itemId === itemId ? { ...item, recordedAmount: amount } : item
      )
    }));
  };

  const handleAddItem = (item) => {
    setInventoryCheck(prev => ({
      ...prev,
      inventoryCheckItems: [...prev.inventoryCheckItems, { itemId: item.id, recordedAmount: 0 }]
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        status: 'saved',
        inventoryCheckItems: inventoryCheck.inventoryCheckItems.map(item => ({
          id: item.itemId,
          recordedAmount: item.recordedAmount
        }))
      };
      await apiRequest(`InventoryCheck/${id}`, user.token, payload, 'PUT');
      setInventoryCheck({ ...inventoryCheck, status: 'saved' });
    } catch (err) {
      setError('Failed to save inventory check');
      console.error(err);
    }
  };

  const handleBook = async () => {
    try {
      await apiRequest(`InventoryCheck/${id}/book`, user.token, null, 'POST');
      setInventoryCheck({ ...inventoryCheck, status: 'booked' });
    } catch (err) {
      setError('Failed to book inventory check');
      console.error(err);
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!inventoryCheck) {
    return <p>Loading...</p>;
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Inventory Check Details</h1>
      <p>Checked At: {new Date(inventoryCheck.checkedAt).toLocaleString()}</p>
      <p>Status: {inventoryCheck.status}</p>
      <ul>
        {inventoryCheck.inventoryCheckItems.map(item => (
          <li key={item.itemId}>
            Item ID: {item.itemId}, Recorded Amount: 
            <input
              type="number"
              value={item.recordedAmount}
              onChange={(e) => handleAmountChange(item.itemId, e.target.value)}
              disabled={inventoryCheck.status !== 'saved'}
            />
          </li>
        ))}
      </ul>
      {inventoryCheck.status === 'saved' && (
        <div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredItems.map(item => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => handleAddItem(item)}>Add</button>
              </li>
            ))}
          </ul>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleBook}>Book</button>
        </div>
      )}
    </div>
  );
}

export default ViewInventoryCheck;