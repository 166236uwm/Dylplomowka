import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function NewInventoryCheck({ user }) {
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
        setSelectedItems(prev => [...prev, { itemId: item.id, itemName: item.name, recordedAmount: 0 }]);
    };

    const handleAmountChange = (itemId, amount) => {
        setSelectedItems(prev => 
            prev.map(item => 
                item.itemId === itemId ? { ...item, recordedAmount: amount } : item
            )
        );
    };

    const handleSave = async () => {
        try {
            const payload = {
                inventoryCheckItems: selectedItems.map(item => ({
                    id: item.itemId,
                    recordedAmount: Number(item.recordedAmount)
                })),
                status: 'saved',
                checkedAt: new Date().toISOString()
            };
            await apiRequest('InventoryCheck', user.token, payload, 'POST');
            navigate('/inventory');
        } catch (err) {
            setError('Failed to save inventory check');
            console.error(err);
        }
    };

    const handleBook = async () => {
        try {
            const payload = {
                inventoryCheckItems: selectedItems.map(item => ({
                    id: item.itemId,
                    recordedAmount: Number(item.recordedAmount)
                }))
            };
            const response = await apiRequest('InventoryCheck', user.token, payload, 'POST');
            const inventoryCheckId = response.id;
            await apiRequest(`InventoryCheck/${inventoryCheckId}/book`, user.token, null, 'POST');
            navigate('/inventory');
        } catch (err) {
            setError('Failed to book inventory check');
            console.error(err);
        }
    };

    const filteredItems = Array.isArray(items) ? items.filter(item => 
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className='showItems'>
            <h1>New Inventory Check</h1>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
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
                        <th>Recorded Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedItems.map(item => (
                        <tr key={item.itemId}>
                            <td>{item.itemName}</td>
                            <td>
                                <input 
                                    type="number" 
                                    value={item.recordedAmount} 
                                    onChange={(e) => handleAmountChange(item.itemId, e.target.value)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave}>Save Inventory Check</button>
            <button onClick={handleBook}>Book Inventory Check</button>
        </div>
    );
}

export default NewInventoryCheck;
