import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ShowItems({ user }) {
  const [itemsByLocation, setItemsByLocation] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const groupedItems = await apiRequest('Items/grouped-by-location', user.token, null, 'GET');
        setItemsByLocation(groupedItems);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };
    fetchItems();
  }, [user.token]);

  const handleAddItem = async () => {
    try {
      const newItem = await apiRequest('Items', user.token, { name: newItemName, locationId: newItemLocation }, 'POST');
      setItemsByLocation(prevItems => {
        const locationIndex = prevItems.findIndex(loc => loc.locationId === newItemLocation);
        if (locationIndex !== -1) {
          prevItems[locationIndex].items.push(newItem);
        } else {
          prevItems.push({ locationId: newItemLocation, locationName: 'New Location', items: [newItem] });
        }
        return [...prevItems];
      });
      setNewItemName('');
      setNewItemLocation('');
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceLocationIndex = itemsByLocation.findIndex(loc => loc.locationId === parseInt(result.source.droppableId));
    const destinationLocationIndex = itemsByLocation.findIndex(loc => loc.locationId === parseInt(result.destination.droppableId));

    const [movedItem] = itemsByLocation[sourceLocationIndex].items.splice(result.source.index, 1);
    movedItem.locationId = parseInt(result.destination.droppableId);
    itemsByLocation[destinationLocationIndex].items.splice(result.destination.index, 0, movedItem);

    setItemsByLocation([...itemsByLocation]);

    try {
      await apiRequest(`Items/${movedItem.id}`, user.token, {
        id: movedItem.id,
        name: movedItem.name,
        currentStock: movedItem.currentStock,
        locationId: movedItem.locationId,
        defaultUnitSize: movedItem.defaultUnitSize,
        unit: movedItem.unit
      }, 'PUT');
    } catch (err) {
      setError('Failed to update item location');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Show Items</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New Item Name"
        />
        <input
          type="text"
          value={newItemLocation}
          onChange={(e) => setNewItemLocation(e.target.value)}
          placeholder="Location ID"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {itemsByLocation.map(location => (
          <Droppable key={location.locationId} droppableId={location.locationId.toString()}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h2>{location.locationName}</h2>
                <ul>
                  {location.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {item.name} - Current Stock: {item.currentStock}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default ShowItems;