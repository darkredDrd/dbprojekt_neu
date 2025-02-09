import React, { useEffect, useState } from 'react';
import { fetchBuildingById } from '../../services/buildingService';

function BuildingDetail({ match }) {
    const [building, setBuilding] = useState(null);
    const { id } = match.params;

    useEffect(() => {
        async function loadBuilding() {
            const building = await fetchBuildingById(id);
            setBuilding(building);
        }
        loadBuilding();
    }, [id]);

    if (!building) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Building Detail</h2>
            <p>Name: {building.name}</p>
            <p>Birth Date: {building.birth_date}</p>
        </div>
    );
}

export default BuildingDetail;