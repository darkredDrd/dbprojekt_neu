import React, { useEffect, useState } from 'react';
import { fetchActors, deleteActor } from '../../services/actorService';
import ActorModal from './ActorModal';

function ActorList() {
    const [actors, setActors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [actorToEdit, setActorToEdit] = useState(null);

    const loadActors = async () => {
        const actors = await fetchActors();
        setActors(actors);
    };

    useEffect(() => {
        loadActors();
    }, []);

    const handleDelete = async (id) => {
        await deleteActor(id);
        loadActors();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setActorToEdit(null);
    };

    const handleEdit = (actor) => {
        setActorToEdit(actor);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h2>Actors</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowModal}>Create Actor</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Birth Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {actors.map(actor => (
                        <tr key={actor.id}>
                            <td>{actor.name}</td>
                            <td>{actor.birth_date}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(actor)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(actor.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ActorModal
                show={showModal}
                handleClose={handleCloseModal}
                refreshActors={loadActors}
                actorToEdit={actorToEdit}
            />
        </div>
    );
}

export default ActorList;