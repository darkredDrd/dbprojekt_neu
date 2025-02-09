import React, { useEffect, useState } from 'react';
import { fetchBuildings } from '../../services/buildingService';

function BuildingList() {
    const [building, setBuildings] = useState([]);

    useEffect(() => {
        async function loadBuildings() {
            const actors = await fetchBuildings();
            setBuildings(buildings);
        }
        loadBuildings();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Buildings</h2>
            <ul className="list-group">
                {buildings.map(building => (
                    <li key={building.id} className="list-group-item">
                        {building.name} - {building.address}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BuildingList;