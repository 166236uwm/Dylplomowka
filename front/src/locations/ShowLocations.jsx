import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';

function ShowLocations({ user }) {
  const [locations, setLocations] = useState([]);
  const [itemsByLocation, setItemsByLocation] = useState([]);
  const [error, setError] = useState('');
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');

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
//TODO: fix expanding locations - either use grouped by location, or investigate passing items when location is requested
  return (
    <div>
      <h1>Locations List</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <input
          type="text"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          placeholder="New Location Name"
        />
        <button onClick={handleAddLocation}>Add Location</button>
      </div>
      <ul id="locations-list">
        {locations.map(location => (
          <li key={location.id} className="location-card">
            <div>
              {location.name}
              <button onClick={() => handleDeleteLocation(location.id)}>Delete</button>
              <button onClick={() => handleExpandLocation(location.id)}>
                {expandedLocation === location.id ? 'Collapse' : 'Expand'}
              </button>
            </div>
            {expandedLocation === location.id && (
              <ul className="items-list">
                {itemsByLocation[location.id]?.map(item => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowLocations;