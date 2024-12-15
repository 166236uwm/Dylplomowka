import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/auth';

function ConfigurationPanel({ user }) {
    const [configurations, setConfigurations] = useState([]);
    const [error, setError] = useState('');
    const [currentConfig, setCurrentConfig] = useState({ defaultStockDays: 7, leadTimeDays: 2, safetyStock: 0 });

    useEffect(() => {
        const fetchConfigurations = async () => {
            try {
                const data = await apiRequest('StockConfiguration', user.token, null, 'GET');
                setConfigurations(data);
                if (data.length > 0) {
                    setCurrentConfig(data[0]);
                }
            } catch (err) {
                setError('Failed to fetch configurations');
                console.error(err);
            }
        };

        fetchConfigurations();
    }, [user.token]);

    const handleUpdate = async () => {
        try {
            await apiRequest(`StockConfiguration/${currentConfig.id}`, user.token, currentConfig, 'PUT');
            const data = await apiRequest('StockConfiguration', user.token, null, 'GET');
            setConfigurations(data);
        } catch (err) {
            setError('Failed to update configuration');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentConfig(prevConfig => ({
            ...prevConfig,
            [name]: value
        }));
    };

    return (
        <div>
            <h1>Konfiguracja zapasów</h1>
            {error && <p className="error">{error}</p>}
            <div>
                <h2>Edutuj konfigurację</h2>
                <p>
                    <label>
                        Na ile dni zapas:
                        <input
                            type="number"
                            name="defaultStockDays"
                            value={currentConfig.defaultStockDays}
                            onChange={handleChange}
                        />
                    </label>
                </p>
                <p><label>
                    Docelowy czas od zamówienia do dostawy {"[dni]"}:
                    <input
                        type="number"
                        name="leadTimeDays"
                        value={currentConfig.leadTimeDays}
                        onChange={handleChange}
                    />
                </label>
                </p>
                <p>
                    <label>
                        Mnożnik zapasu bezpieczeństwa {"[0-1]"}:
                        <input
                            type="number"
                            name="safetyStock"
                            value={currentConfig.safetyStock}
                            onChange={handleChange}
                        />
                    </label>
                    </p>
                <button onClick={handleUpdate}>Aktualizuj</button>
            </div>
        </div>
    );
}

export default ConfigurationPanel;