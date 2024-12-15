import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/auth';

function NewTransaction({ user }) {
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
        transactionItems: selectedItems.map(item => ({
          itemId: item.itemId,
          amount: Number(item.amount)
        }))
      };
      await apiRequest('Transaction', user.token, payload, 'POST');
      navigate('/home');
    } catch (err) {
      setError('Failed to save transaction');
      console.error(err);
    }
  };

  return (
    <div className='showItems'>
      <h1>Nowa wysyłka</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Szukaj..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Nazwa Przedmiotu</th>
            <th>Obeacny Zapas</th>
            <th>Wielkość Jednostki</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.currentStock}</td>
              <td>{item.defaultUnitSize} {item.unit}</td>
              <td>
                <button onClick={() => handleAddItem(item)}>Dodaj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Wybrane Przedmioty</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa przedmiotu</th>
            <th>Ilość</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map(item => (
            <tr key={item.itemId}>
              <td>{item.itemName}</td>
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
      <button onClick={handleSave}>Zapisz wysyłkę</button>
    </div>
  );
}

export default NewTransaction;