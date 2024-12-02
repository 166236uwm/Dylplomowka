import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function NewDelivery({ user }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const fetchedItems = await apiRequest('Items', user.token, null, 'GET');
      setItems(fetchedItems);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user.token]);

  const handleAddItem = (item) => {
    setSelectedItems(prev => [...prev, { itemId: item.id, itemName: item.name, amount: 0 }]);
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleAmountChange = (itemId, amount) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, amount } : item
      )
    );
  };

  const handleSave = async () => {
    try {
        const payload = {
            deliveredItems: selectedItems.map(item => ({
                itemId: item.itemId,
                amount: Number(item.amount)
            })),
            status: 'saved',
            bookedAt: new Date().toISOString()
        };
        const response = await apiRequest('Delivery', user.token, payload, 'POST');
        navigate('/deliveries');
    } catch (err) {
        setError('Failed to save delivery');
        console.error(err);
    }
  };

  return (
    <div>
      <h1>New Delivery</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleAddItem(item)}>Add</button>
          </li>
        ))}
      </ul>
      <h2>Selected Items</h2>
      <ul>
        {selectedItems.map(item => (
          <li key={item.itemId}>
            {item.itemName}
            <input
              type="number"
              value={item.amount}
              onChange={(e) => handleAmountChange(item.itemId, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save Delivery</button>
    </div>
  );
}

export default NewDelivery;