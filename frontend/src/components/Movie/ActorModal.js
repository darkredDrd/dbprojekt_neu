import React, { useEffect, useState } from 'react';
import { fetchActors } from '../../services/actorService';
import { addActorToMovie } from '../../services/movieActorService';

function ActorModal({ show, handleClose, movieId, refreshMovies }) {
    const [actors, setActors] = useState([]);
    const [selectedActorId, setSelectedActorId] = useState('');

    useEffect(() => {
        async function loadActors() {
            const actors = await fetchActors();
            setActors(actors);
        }
        if (show) {
            loadActors();
        }
    }, [show]);

    const handleAddActor = async () => {
        if (selectedActorId) {
            await addActorToMovie(movieId, selectedActorId);
            refreshMovies();
            handleClose();
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Actor to Movie</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Select Actor</label>
                            <select
                                className="form-control"
                                value={selectedActorId}
                                onChange={(e) => setSelectedActorId(e.target.value)}
                            >
                                <option value="">Select an actor</option>
                                {actors.map(actor => (
                                    <option key={actor.id} value={actor.id}>
                                        {actor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddActor}>Add Actor</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActorModal;