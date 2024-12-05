import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function NewDelivery({ user }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toOrderData, setToOrderData] = useState([]);
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

  const fetchToOrderData = async () => {
    try {
      const data = await apiRequest('Items/toOrder', user.token, null, 'GET');
      setToOrderData(data);
    } catch (err) {
      setError('Failed to fetch to order data');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchToOrderData();
  }, [user.token]);

  const handleAddItem = (item) => {
    setSelectedItems(prev => [...prev, { itemId: item.id, itemName: item.name, amount: 0, currentStock: item.currentStock }]);
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
      await apiRequest('Delivery', user.token, payload, 'POST');
      navigate('/deliveries');
    } catch (err) {
      setError('Failed to save delivery');
      console.error(err);
    }
  };

  const getRequiredStock = (itemId) => {
    const item = toOrderData.find(data => data.id === itemId);
    return item ? item.requiredStock : 'N/A';
  };

  const getToOrder = (itemId, currentStock) => {
    const requiredStock = getRequiredStock(itemId);
    return requiredStock !== 'N/A' ? Math.max(0, requiredStock - currentStock) : 'N/A';
  };

  return (
    <div className='showItems'>
      <h1>New Delivery</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Current Stock</th>
            <th>Required Stock</th>
            <th>To Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.currentStock}</td>
              <td>{Math.round(getRequiredStock(item.id))}</td>
              <td>{Math.round(getToOrder(item.id, item.currentStock))}</td>
              <td>
                <button onClick={() => handleAddItem(item)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Selected Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Current Stock</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map(item => (
            <tr key={item.itemId}>
              <td>{item.itemName}</td>
              <td>{item.currentStock}</td>
              <td>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(item.itemId, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Save Delivery</button>
    </div>
  );
}

export default NewDelivery;