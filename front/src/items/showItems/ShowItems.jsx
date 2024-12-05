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
  const [newItemPrice, setNewItemPrice] = useState('');
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const groupedItems = await apiRequest('Items/grouped-by-location', user.token, null, 'GET');
      setItemsByLocation(groupedItems);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const locationsData = await apiRequest('Locations', user.token, null, 'GET');
      setLocations(locationsData);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchLocations();
  }, [user.token]);

  const handleAddItem = async () => {
    try {
      await apiRequest('Items', user.token, {
        name: newItemName,
        locationId: newItemLocation,
        defaultUnitSize: newItemUnitSize,
        unit: newItemUnit,
        price: newItemPrice
      }, 'POST');
      fetchItems();
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
        unit: movedItem.unit,
        price: movedItem.price
      }, 'PUT');
    } catch (err) {
      setError('Failed to update item location');
      console.error(err);
    }
  };

  return (
    <div className='showItems'>
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
        <input
          type="number"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          placeholder="Price"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {locations.map(location => {
          const locationItems = itemsByLocation.find(itemGroup => itemGroup.locationId === location.id)?.items || [];
          return (
            <Droppable key={`location-${location.id}`} droppableId={location.id.toString()}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>{location.name}</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Current Stock</th>
                        <th>Unit Size</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationItems.length > 0 ? (
                        locationItems.map((item, index) => (
                          <Draggable key={`item-${item.id}`} draggableId={item.id.toString()} index={index}>
                            {(provided) => (
                              <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <td>{item.name}</td>
                                <td>{item.currentStock}</td>
                                <td>{item.defaultUnitSize} {item.unit}</td>
                                <td>{item.price}</td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No items available</td>
                        </tr>
                      )}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default ShowItems;