import { useEffect, useState } from 'react';
import { authorisedWithoutBody } from '../api/auth';
import './ShowLocations.css';

function ShowLocations({ user }) {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const data = await authorisedWithoutBody('Locations', user.token);
//         setLocations(data);
//       } catch (err) {
//         setError('Failed to fetch locations');
//         console.error(err);
//       }
//     };

//     fetchLocations();
//   }, [user.token]);

  return (
    <div>
      <h1>Locations List</h1>
      {error && <p className="error">{error}</p>}
      <ul id="locations-list">
        {locations.map(location => (
          <li key={location.id} className="location-card">
            {location.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowLocations;