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
            console.log('Fetched Items:', fetchedItems); // Log the fetched items
            if (Array.isArray(fetchedItems)) {
                setItems(fetchedItems);
            } else {
                console.error('Fetched items is not an array:', fetchedItems);
                setItems([]); // Set to an empty array if the response is not as expected
            }
        } catch (err) {
            setError('Failed to fetch items');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [user.token]);

    const handleAddItem = (item) => {
        console.log('Adding item:', item); // Log the item being added
        if (item.itemId) { // Check if item has an id
            setSelectedItems(prev => [...prev, { itemId: item.itemId, itemName: item.itemName, recordedAmount: 0 }]); // Store itemName
        } else {
            console.error('Item does not have an id:', item); // Log an error if id is missing
        }
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
                    recordedAmount: Number(item.recordedAmount) // Convert the recorded amount to a number
                }))
            };
            console.log('Payload to be sent:', payload); // Log the payload
            await apiRequest('InventoryCheck', user.token, payload, 'POST');
            navigate('/inventory'); // Redirect to inventory checks after saving
        } catch (err) {
            setError('Failed to save inventory check');
            console.error(err);
        }
    };

    const filteredItems = Array.isArray(items) ? items.filter(item => 
        item.itemName && item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div>
            <h1>New Inventory Check</h1>
            {error && <p className="error">{error}</p>}
            <input 
                type="text" 
                placeholder="Search items..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <ul>
                {filteredItems.map(item => (
                    <li key={item.itemId}>
                        {item.itemName}
                        <button onClick={() => handleAddItem(item)}>Add</button>
                    </li>
                ))}
            </ul>
            <h2>Selected Items</h2>
            <ul>
                {selectedItems.map(item => (
                    <li key={item.itemId}>
                        Item: {item.itemName} {/* Display the item name instead of itemId */}
                        <input 
                            type="number" 
                            value={item.recordedAmount} 
                            onChange={(e) => handleAmountChange(item.itemId, e.target.value)} 
                        />
                    </li>
                ))}
            </ul>
            <button onClick={handleSave}>Save Inventory Check</button>
        </div>
    );
}

export default NewInventoryCheck;
