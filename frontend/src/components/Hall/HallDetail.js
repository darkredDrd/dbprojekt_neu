import React, { useEffect, useState } from 'react';
import { fetchHallById } from '../../services/hallService';

function HallDetail({ match }) {
    const [hall, setHall] = useState(null);
    const { id } = match.params;

    useEffect(() => {
        async function loadHall() {
            const hall = await fetchHallById(id);
            setHall(hall);
        }
        loadHall();
    }, [id]);

    if (!hall) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Hall Detail</h2>
            <p>Building ID: {hall.building_id}</p>
            <p>Name: {hall.name}</p>
            <p>Seats: {hall.seats}</p>
        </div>
    );
}

export default HallDetail;