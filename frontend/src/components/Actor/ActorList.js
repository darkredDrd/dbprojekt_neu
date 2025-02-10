import React, { useEffect, useState } from 'react';
import { fetchActors, deleteActor } from '../../services/actorService';
import ActorModal from './ActorModal';
import ActorMoviesModal from './ActorMoviesModal';

function ActorList() {
    const [actors, setActors] = useState([]);
    const [showActorModal, setShowActorModal] = useState(false);
    const [showActorMoviesModal, setShowActorMoviesModal] = useState(false);
    const [actorToEdit, setActorToEdit] = useState(null);
    const [selectedActorId, setSelectedActorId] = useState(null);

    const loadActors = async () => {
        try {
            const actors = await fetchActors();
            setActors(actors);
        } catch (error) {
            console.error('Failed to fetch actors:', error);
        }
    };

    useEffect(() => {
        loadActors();
    }, []);

    const handleDelete = async (id) => {
        await deleteActor(id);
        loadActors();
    };

    const handleShowActorModal = (actor = null) => {
        setActorToEdit(actor);
        setShowActorModal(true);
    };

    const handleCloseActorModal = () => {
        setShowActorModal(false);
        setActorToEdit(null);
    };

    const handleShowActorMoviesModal = (actorId) => {
        setSelectedActorId(actorId);
        setShowActorMoviesModal(true);
    };

    const handleCloseActorMoviesModal = () => {
        setShowActorMoviesModal(false);
        setSelectedActorId(null);
    };

    return (
        <div className="container mt-5">
            <h2>Actors</h2>
            <button className="btn btn-primary mb-3" onClick={() => handleShowActorModal()}>Add Actor</button>
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
                                <button className="btn btn-warning mr-2" onClick={() => handleShowActorModal(actor)}>Edit</button>
                                <button className="btn btn-danger mr-2" onClick={() => handleDelete(actor.id)}>Delete</button>
                                <button className="btn btn-info" onClick={() => handleShowActorMoviesModal(actor.id)}>Add to Movie</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ActorModal
                show={showActorModal}
                handleClose={handleCloseActorModal}
                refreshActors={loadActors}
                actorToEdit={actorToEdit}
            />
            <ActorMoviesModal
                show={showActorMoviesModal}
                handleClose={handleCloseActorMoviesModal}
                actorId={selectedActorId}
            />
        </div>
    );
}

export default ActorList;