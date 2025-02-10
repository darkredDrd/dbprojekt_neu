import React, { useEffect, useState } from 'react';
import { fetchHalls, deleteHall, fetchBuildings } from '../../services/hallService';
import HallModal from './HallModal';

function HallList() {
    const [halls, setHalls] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hallToEdit, setHallToEdit] = useState(null);

    const loadHalls = async () => {
        try {
            const halls = await fetchHalls();
            const buildings = await fetchBuildings();
            if (Array.isArray(halls) && Array.isArray(buildings)) {
                setHalls(halls);
                setBuildings(buildings);
            } else {
                console.error('Fetched data is not an array:', halls, buildings);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        loadHalls();
    }, []);

    const handleDelete = async (id) => {
        await deleteHall(id);
        loadHalls();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setHallToEdit(null);
    };

    const handleEdit = (hall) => {
        setHallToEdit(hall);
        setShowModal(true);
    };

    const getBuildingName = (id) => {
        const building = buildings.find(building => building.id === id);
        return building ? building.name : 'Unknown';
    };

    return (
        <div className="container mt-5">
            <h2>Halls</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowModal}>Create Hall</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Building</th>
                        <th>Name</th>
                        <th>Seats</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {halls.map(hall => (
                        <tr key={hall.id}>
                            <td>{getBuildingName(hall.building_id)}</td>
                            <td>{hall.name}</td>
                            <td>{hall.seats}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(hall)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(hall.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <HallModal
                show={showModal}
                handleClose={handleCloseModal}
                refreshHalls={loadHalls}
                hallToEdit={hallToEdit}
                buildings={buildings}
            />
        </div>
    );
}

export default HallList;