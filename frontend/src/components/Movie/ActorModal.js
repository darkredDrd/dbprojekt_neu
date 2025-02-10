import React, { useEffect, useState } from 'react';
import { fetchActors } from '../../services/actorService';
import { addActorToMovie, fetchMovieActors } from '../../services/movieActorService';

function ActorModal({ show, handleClose, movieId, refreshMovies }) {
    const [actors, setActors] = useState([]);
    const [selectedActorId, setSelectedActorId] = useState('');
    const [existingActors, setExistingActors] = useState([]);

    useEffect(() => {
        async function loadActors() {
            const actors = await fetchActors();
            setActors(actors);
        }

        async function loadExistingActors() {
            const actors = await fetchMovieActors(movieId);
            setExistingActors(actors);
        }

        if (show) {
            loadActors();
            loadExistingActors();
        }
    }, [show, movieId]);

    const handleAddActor = async () => {
        if (selectedActorId) {
            const actorExists = existingActors.some(actor => actor.id === parseInt(selectedActorId, 10));
            if (actorExists) {
                alert('The actor already exists in the movie.');
                return;
            }
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