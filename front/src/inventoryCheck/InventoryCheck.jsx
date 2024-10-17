import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';


// TODO: remake requests to backend so that they use auth.jsx

function InventoryCheck() {
    // const [items, setItems] = useState([]);
    // const [inventoryCheck, setInventoryCheck] = useState({ checkedAt: new Date(), inventoryCheckItems: [] });
    // const [isEditing, setIsEditing] = useState(false);

    // useEffect(() => {
    //     const loadItems = async () => {
    //         const fetchedItems = await fetchItems();
    //         setItems(fetchedItems);
    //     };
    //     loadItems();
    // }, []);

    // const handleItemChange = (itemId, amount) => {
    //     const existingItem = inventoryCheck.inventoryCheckItems.find(item => item.itemId === itemId);
    //     if (existingItem) {
    //         existingItem.recordedAmount = amount;
    //     } else {
    //         setInventoryCheck(prev => ({
    //             ...prev,
    //             inventoryCheckItems: [...prev.inventoryCheckItems, { itemId, recordedAmount: amount }]
    //         }));
    //     }
    // };

    // const handleSubmit = async () => {
    //     const url = isEditing ? `/api/InventoryCheck/${inventoryCheck.id}` : '/api/InventoryCheck';
    //     const method = isEditing ? 'PUT' : 'POST';
    //     const response = await apiRequest(url, user.token, inventoryCheck, method);
    //     // Reset form or handle success
    // };

    // const handleBook = async () => {
    //     await apiRequest(`/api/InventoryCheck/book/${inventoryCheck.id}`, user.token, null, 'POST');
    //     // Handle booking success
    // };

    return (
        <div>
            {/* <h1>Inventory Check</h1>
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
            {isEditing && <button onClick={handleBook}>Book Inventory Check</button>} */}
        </div>
    );
}

export default InventoryCheck;
