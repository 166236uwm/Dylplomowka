import { useEffect, useState } from 'react';
import { apiRequest } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function InventoryCheck({ user }) {
    const [inventoryChecks, setInventoryChecks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchInventoryChecks = async () => {
        try {
            const fetchedChecks = await apiRequest('InventoryCheck', user.token, null, 'GET');
            setInventoryChecks(fetchedChecks);
        } catch (err) {
            setError('Failed to fetch inventory checks');
            console.error(err);
        }
    };

    const handleNewInventoryCheck = () => {
        navigate('/inventory/new');
    };

    useEffect(() => {
        fetchInventoryChecks();
    }, [user.token]);

    const savedChecks = inventoryChecks.filter(check => check.status === 'saved');
    const bookedChecks = inventoryChecks.filter(check => check.status === 'booked');

    return (
        <div>
            <h1>Inwentaryzacje</h1>
            {error && <p className="error">{error}</p>}
            {inventoryChecks.length === 0 ? (
                <p>Brak przeszłych inwentaryzacji</p>
            ) : (
                <>
                    <h2>Zapisane inwentaryzacje</h2>
                    <ul>
                        {savedChecks.map(check => (
                            <li key={check.id}>
                                Zapisana: {new Date(check.checkedAt).toLocaleString()}
                                <button onClick={() => navigate(`/inventory/${check.id}`)}>Szczegóły</button>
                            </li>
                        ))}
                    </ul>
                    <h2>Zaksięgowane Inwentaryzacje</h2>
                    <ul>
                        {bookedChecks.map(check => (
                            <li key={check.id}>
                                Zaksięgowana: {new Date(check.checkedAt).toLocaleString()}
                                <button onClick={() => navigate(`/inventory/${check.id}`)}>Szczegóły</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <button onClick={handleNewInventoryCheck}>Nowa Inwentaryzacja</button>
        </div>
    );
}

export default InventoryCheck;