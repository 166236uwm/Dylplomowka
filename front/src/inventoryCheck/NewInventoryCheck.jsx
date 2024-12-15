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
        setSelectedItems(prev => [...prev, { itemId: item.id, itemName: item.name, recordedAmount: 0, currentStock: item.currentStock }]);
        setItems(prev => prev.filter(i => i.id !== item.id));
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

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='showItems'>
            <h1>Nowa Inwentaryzacja</h1>
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
                        <th>Nazwa</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
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
                        <th>Nazwa</th>
                        <th>Ilość teoretyczna</th>
                        <th>Ilość Rzeczywista</th>
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
                                    value={item.recordedAmount} 
                                    onChange={(e) => handleAmountChange(item.itemId, e.target.value)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave}>Zapisz inwentaryzację</button>
        </div>
    );
}

export default NewInventoryCheck;
