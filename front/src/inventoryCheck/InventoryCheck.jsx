import { useEffect, useState } from 'react';
import { unauthorisedWithBody, authorisedWithBody, authorisedWithoutBody } from '../api/auth';


// TODO: remake requests to backend so that they use auth.jsx

function InventoryCheck() {
    const [items, setItems] = useState([]);
    const [inventoryCheck, setInventoryCheck] = useState({ checkedAt: new Date(), inventoryCheckItems: [] });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            const fetchedItems = await fetchItems();
            setItems(fetchedItems);
        };
        loadItems();
    }, []);

    const handleItemChange = (itemId, amount) => {
        const existingItem = inventoryCheck.inventoryCheckItems.find(item => item.itemId === itemId);
        if (existingItem) {
            existingItem.recordedAmount = amount;
        } else {
            setInventoryCheck(prev => ({
                ...prev,
                inventoryCheckItems: [...prev.inventoryCheckItems, { itemId, recordedAmount: amount }]
            }));
        }
    };

    const handleSubmit = async () => {
        const url = isEditing ? `/api/InventoryCheck/${inventoryCheck.id}` : '/api/InventoryCheck';
        const method = isEditing ? 'PUT' : 'POST';
        const response = await authorisedWithBody(url, inventoryCheck, user.token);
        // Reset form or handle success
    };

    const handleBook = async () => {
        await authorisedWithoutBody(`/api/InventoryCheck/book/${inventoryCheck.id}`, user.token);
        // Handle booking success
    };

    return (
        <div>
            <h1>Inventory Check</h1>
            <input type="date" value={inventoryCheck.checkedAt.toISOString().split('T')[0]} onChange={e => setInventoryCheck({ ...inventoryCheck, checkedAt: new Date(e.target.value) })} />
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name}
                        <input type="number" onChange={e => handleItemChange(item.id, e.target.value)} />
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'} Inventory Check</button>
            {isEditing && <button onClick={handleBook}>Book Inventory Check</button>}
        </div>
    );
}

export default InventoryCheck;
