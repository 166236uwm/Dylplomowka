import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';
import { useNavigate, useParams } from 'react-router-dom';

function ViewInventoryCheck({ user }) {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchItems = async () => {
        try {
            const fetchedItems = await apiRequest('Items', user.token, null, 'GET');
            setItems(fetchedItems);
        } catch (err) {
            setError('Failed to fetch items');
            console.error(err);
        }
    };

    const fetchInventoryCheck = async () => {
        try {
            const inventoryCheck = await apiRequest(`InventoryCheck/${id}`, user.token, null, 'GET');
            const addedItems = inventoryCheck.inventoryCheckItems.map(item => ({
                itemId: item.itemId,
                itemName: item.item.name,
                recordedAmount: item.recordedAmount,
                currentStock: item.item.currentStock
            }));
            setSelectedItems(addedItems);
            setStatus(inventoryCheck.status);
        } catch (err) {
            setError('Failed to fetch inventory check');
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchItems();
            await fetchInventoryCheck();
        };
        fetchData();
    }, [user.token, id]);

    useEffect(() => {
        setItems(prevItems => prevItems.filter(item => 
            !selectedItems.some(selectedItem => selectedItem.itemId === item.id)
        ));
    }, [selectedItems]);

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

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='showItems'>
            <h1>Inwentaryzacja</h1>
            {error && <p className="error">{error}</p>}
            {status === 'saved' && (
                <>
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
                </>
            )}
            <h2>Wybrane Przedmioty</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Ilość rzeczywista</th>
                        {status === 'saved' && <th>Ilość teoretyczna</th>}
                    </tr>
                </thead>
                <tbody>
                    {selectedItems.map(item => (
                        <tr key={item.itemId}>
                            <td>{item.itemName}</td>
                            {status === 'saved' ? (<>
                                <td>
                                    <input
                                        type="number"
                                        value={item.recordedAmount}
                                        onChange={(e) => handleAmountChange(item.itemId, e.target.value)}
                                    />
                                </td>
                                <td>{item.currentStock}</td>
                            </>
                            ) : (
                                <td>{item.recordedAmount}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewInventoryCheck;
