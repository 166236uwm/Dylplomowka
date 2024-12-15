import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';

function ShowLocations({ user }) {
  const [locations, setLocations] = useState([]);
  const [itemsByLocation, setItemsByLocation] = useState([]);
  const [error, setError] = useState('');
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');
  const [editLocationId, setEditLocationId] = useState(null);
  const [editLocationName, setEditLocationName] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await apiRequest('Locations', user.token, null, 'GET');
        setLocations(data);
      } catch (err) {
        setError('Failed to fetch locations');
        console.error(err);
      }
    };

    const fetchItems = async () => {
      try {
        const groupedItems = await apiRequest('Items/grouped-by-location', user.token, null, 'GET');
        setItemsByLocation(groupedItems);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };

    fetchLocations();
    fetchItems();
  }, [user.token]);

  const handleAddLocation = async () => {
    try {
      const newLocation = await apiRequest('Location', user.token, { name: newLocationName }, 'POST');
      setLocations([...locations, newLocation]);
      setNewLocationName('');
    } catch (err) {
      setError('Failed to add location');
      console.error(err);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await apiRequest(`Location/${locationId}`, user.token, null, 'DELETE');
      setLocations(locations.filter(location => location.id !== locationId));
    } catch (err) {
      setError('Failed to delete location');
      console.error(err);
    }
  };

  const handleExpandLocation = (locationId) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  const handleEditLocation = (id, name) => {
    setEditLocationId(id);
    setEditLocationName(name);
  };

  const handleCancelEdit = () => {
    setEditLocationId(null);
    setEditLocationName('');
  };

  const handleSubmitEdit = async () => {
    try {
      await apiRequest(`Location/${editLocationId}`, user.token, { id:editLocationId, name: editLocationName }, 'PUT');
      setLocations(locations.map(location => 
        location.id === editLocationId ? { ...location, name: editLocationName } : location
      ));
      setEditLocationId(null);
      setEditLocationName('');
    } catch (error) {
      setError('Failed to update location');
    }
  };

  return (
    <div>
      <h1>Lista Lokalizacji</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <input
          type="text"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          placeholder="Nazwa nowej lokalizacji"
        />
        <button onClick={handleAddLocation}>Dodaj Lokalizację</button>
      </div>
      <ul id="locations-list">
        {locations.map(location => (
          <li key={location.id} className="location-card">
            <div>
              {editLocationId === location.id ? (
                <>
                  <input
                    type="text"
                    value={editLocationName}
                    onChange={(e) => setEditLocationName(e.target.value)}
                  />
                  <button onClick={handleSubmitEdit}>Zatwierdź</button>
                  <button onClick={handleCancelEdit}>Anuluj</button>
                </>
              ) : (
                <>
                  {location.name}
                  <button onClick={() => handleDeleteLocation(location.id)}>Usuń</button>
                  <button onClick={() => handleExpandLocation(location.id)}>
                    {expandedLocation === location.id ? 'Zwiń' : 'Rozwiń'}
                  </button>
                  <button onClick={() => handleEditLocation(location.id, location.name)}>Edytuj</button>
                </>
              )}
            </div>
            {expandedLocation === location.id && (
              <ul>
                {itemsByLocation
                  .filter(itemGroup => itemGroup.locationId === location.id)
                  .map(itemGroup => (
                    itemGroup.items.length > 0 ? (
                      itemGroup.items.map(item => (
                        <li key={item.id}>
                          {item.name} - Obecny Zapas: {item.currentStock}
                        </li>
                      ))
                    ) : (
                      <li key="no-items">Brak dostępnych przedmiotów</li>
                    )
                  ))
                }
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowLocations;