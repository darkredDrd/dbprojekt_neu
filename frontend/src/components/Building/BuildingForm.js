import React, { useState } from 'react';
import { createBuilding } from '../../services/buildingService';

function BuildingForm() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const building = { name, address: address };
        await createBuilding(building);
        setName('');
        setAddress('');
    };

    return (
        <div className="container mt-5">
            <h2>Add Building</h2>
            <form onSubmit={handleSubmit}>
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
                    <label>Address</label>
                    <input
                        type="string"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddres(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Building</button>
            </form>
        </div>
    );
}

export default BuildingForm;