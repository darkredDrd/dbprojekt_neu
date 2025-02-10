import React, { useEffect, useState } from 'react';
import { fetchMovies, deleteMovie } from '../../services/movieService';
import { fetchMovieActors, addActorToMovie, deleteActorFromMovie } from '../../services/movieActorService';
import MovieModal from './MovieModal';
import ActorModal from './ActorModal';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [showActorModal, setShowActorModal] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState(null);
    const [expandedMovieId, setExpandedMovieId] = useState(null);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const loadMovies = async () => {
        try {
            const movies = await fetchMovies();
            if (Array.isArray(movies)) {
                const moviesWithActors = await Promise.all(
                    movies.map(async (movie) => {
                        const actors = await fetchMovieActors(movie.id);
                        return { ...movie, actors };
                    })
                );
                setMovies(moviesWithActors);
            } else {
                console.error('Fetched movies is not an array:', movies);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    const handleDelete = async (id) => {
        await deleteMovie(id);
        loadMovies();
    };

    const handleShowMovieModal = () => setShowMovieModal(true);
    const handleCloseMovieModal = () => {
        setShowMovieModal(false);
        setMovieToEdit(null);
    };

    const handleShowActorModal = (movieId) => {
        setSelectedMovieId(movieId);
        setShowActorModal(true);
    };

    const handleCloseActorModal = () => {
        setShowActorModal(false);
        setSelectedMovieId(null);
    };

    const handleEdit = (movie) => {
        setMovieToEdit(movie);
        setShowMovieModal(true);
    };

    const toggleExpand = (movieId) => {
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
    };

    const handleDeleteActor = async (movieId, actorId) => {
        await deleteActorFromMovie(movieId, actorId);
        loadMovies();
    };

    return (
        <div className="container mt-5">
            <h2>Movies</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowMovieModal}>Create Movie</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Duration (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <React.Fragment key={movie.id}>
                            <tr>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.duration_minutes}</td>
                                <td>
                                    <button className="btn btn-warning mr-2" onClick={() => handleEdit(movie)}>Update</button>
                                    <button className="btn btn-danger mr-2" onClick={() => handleDelete(movie.id)}>Delete</button>
                                    <button className="btn btn-info" onClick={() => toggleExpand(movie.id)}>
                                        {expandedMovieId === movie.id ? 'Close Actors' : 'Show Actors'}
                                    </button>
                                </td>
                            </tr>
                            {expandedMovieId === movie.id && (
                                <tr>
                                    <td colSpan="4">
                                        <h5>Actors</h5>
                                        <ul>
                                            {movie.actors.map(actor => (
                                                <li key={actor.id}>
                                                    {actor.name}
                                                    <button
                                                        className="btn btn-danger btn-sm ml-2"
                                                        onClick={() => handleDeleteActor(movie.id, actor.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="btn btn-secondary" onClick={() => handleShowActorModal(movie.id)}>
                                            Add Actors to Movie
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <MovieModal
                show={showMovieModal}
                handleClose={handleCloseMovieModal}
                refreshMovies={loadMovies}
                movieToEdit={movieToEdit}
            />
            <ActorModal
                show={showActorModal}
                handleClose={handleCloseActorModal}
                movieId={selectedMovieId}
                refreshMovies={loadMovies}
            />
        </div>
    );
}

export default MovieList;