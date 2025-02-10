import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import { fetchMovieActors, addActorToMovie, deleteActorFromMovie } from '../../services/movieActorService';

function ActorMoviesModal({ show, handleClose, actorId }) {
    const [movies, setMovies] = useState([]);
    const [actorMovies, setActorMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');

    useEffect(() => {
        async function loadMovies() {
            const movies = await fetchMovies();
            setMovies(movies);
        }

        if (show) {
            loadMovies();
            loadActorMovies();
        }
    }, [show, actorId]);

    const loadActorMovies = async () => {
        const actorMovies = await fetchMovieActors(actorId);
        setActorMovies(actorMovies);
    };

    const handleAddMovie = async () => {
        if (selectedMovieId) {
            const movieExists = actorMovies.some(movie => movie.id === parseInt(selectedMovieId, 10));
            if (movieExists) {
                alert('The actor is already associated with this movie.');
                return;
            }
            await addActorToMovie(selectedMovieId, actorId);
            loadActorMovies();
            setSelectedMovieId('');
        }
    };

    const handleDeleteMovie = async (movieId) => {
        await deleteActorFromMovie(movieId, actorId);
        loadActorMovies();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Movies for Actor</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h5>Movies</h5>
                        <ul>
                            {actorMovies.map(movie => (
                                <li key={movie.id}>
                                    {movie.title}
                                    <span
                                        className="text-danger ml-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDeleteMovie(movie.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="form-group">
                            <label>Add Movie</label>
                            <select
                                className="form-control"
                                value={selectedMovieId}
                                onChange={(e) => setSelectedMovieId(e.target.value)}
                            >
                                <option value="">Select a movie</option>
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.id}>
                                        {movie.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddMovie}>Add Movie</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActorMoviesModal;