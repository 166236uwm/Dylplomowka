import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/auth';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ShowItems = ({ user }) => {
  const [itemsByLocation, setItemsByLocation] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemUnitSize, setNewItemUnitSize] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const groupedItems = await apiRequest('Items/grouped-by-location', user.token, null, 'GET');
      setItemsByLocation(groupedItems);
      setLocations(groupedItems.map(location => ({ id: location.locationId, name: location.locationName })));
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user.token]);

  const handleAddItem = async () => {
    try {
      await apiRequest('Items', user.token, {
        name: newItemName,
        locationId: newItemLocation,
        unitSize: newItemUnitSize,
        unit: newItemUnit
      }, 'POST');
      fetchItems(); // Fetch items again after adding a new item
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
      <h1>Items</h1>
      {error && <p>{error}</p>}
      <div>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item Name"
        />
        <select
          value={newItemLocation}
          onChange={(e) => setNewItemLocation(e.target.value)}
        >
          <option value="">Select Location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newItemUnitSize}
          onChange={(e) => setNewItemUnitSize(e.target.value)}
          placeholder="Unit Size"
        />
        <input
          type="text"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
          placeholder="Unit"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {itemsByLocation.map(location => (
          <Droppable key={`location-${location.locationId}`} droppableId={location.locationId.toString()}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h2>{location.locationName}</h2>
                <ul>
                  {location.items.map((item, index) => (
                    <Draggable key={`item-${item.id}`} draggableId={item.id.toString()} index={index}>
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
};

export default ShowItems;