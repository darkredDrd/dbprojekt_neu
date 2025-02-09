import React, { useEffect, useState } from 'react';
import { fetchBuildings, deleteBuilding } from '../../services/buildingService';
import BuildingModal from './BuildingModal';

function BuildingList() {
    const [buildings, setBuildings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [buildingToEdit, setBuildingToEdit] = useState(null);

    const loadBuildings = async () => {
        const buildings = await fetchBuildings();
        setBuildings(buildings);
    };

    useEffect(() => {
        loadBuildings();
    }, []);

    const handleDelete = async (id) => {
        await deleteBuilding(id);
        loadBuildings();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setBuildingToEdit(null);
    };

    const handleEdit = (building) => {
        setBuildingToEdit(building);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h2>Buildings</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowModal}>Create Building</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buildings.map(building => (
                        <tr key={building.id}>
                            <td>{building.name}</td>
                            <td>{building.address}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(building)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(building.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <BuildingModal
                show={showModal}
                handleClose={handleCloseModal}
                refreshBuildings={loadBuildings}
                buildingToEdit={buildingToEdit}
            />
        </div>
    );
}

export default BuildingList;