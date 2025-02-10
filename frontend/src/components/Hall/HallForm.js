import React, { useState, useEffect } from 'react';

function HallForm({ hallToEdit, handleSubmit, buildings }) {
    const [buildingId, setBuildingId] = useState('');
    const [name, setName] = useState('');
    const [seats, setSeats] = useState('');

    useEffect(() => {
        if (hallToEdit) {
            setBuildingId(hallToEdit.building_id);
            setName(hallToEdit.name);
            setSeats(hallToEdit.seats);
        } else {
            setBuildingId('');
            setName('');
            setSeats('');
        }
    }, [hallToEdit]);

    const onSubmit = (e) => {
        e.preventDefault();
        const hall = {
            building_id: parseInt(buildingId, 10),
            name,
            seats: parseInt(seats, 10),
        };
        handleSubmit(hall);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Building</label>
                <select
                    className="form-control"
                    value={buildingId}
                    onChange={(e) => setBuildingId(e.target.value)}
                    required
                >
                    <option value="">Select a building</option>
                    {buildings.map(building => (
                        <option key={building.id} value={building.id}>
                            {building.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Seats</label>
                <input
                    type="number"
                    className="form-control"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">{hallToEdit ? 'Update Hall' : 'Add Hall'}</button>
        </form>
    );
}

export default HallForm;