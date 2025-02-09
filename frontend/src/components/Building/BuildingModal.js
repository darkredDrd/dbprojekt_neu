import React, { useState, useEffect } from 'react';
import { createBuilding, updateBuilding } from '../../services/buildingService';

function BuildingModal({ show, handleClose, refreshBuildings, buildingToEdit }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (buildingToEdit) {
            setName(buildingToEdit.name);
            setAddress(buildingToEdit.address);
        } else {
            setName('');
            setAddress('');
        }
    }, [buildingToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const building = { name, address };
        if (buildingToEdit) {
            await updateBuilding(buildingToEdit.id, building);
        } else {
            await createBuilding(building);
        }
        refreshBuildings();
        handleClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{buildingToEdit ? 'Update Building' : 'Add Building'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
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
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">{buildingToEdit ? 'Update Building' : 'Add Building'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuildingModal;