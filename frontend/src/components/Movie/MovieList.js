import React, { useEffect, useState } from 'react';
import { fetchMovies, deleteMovie } from '../../services/movieService';
import MovieModal from './MovieModal';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState(null);

    const loadMovies = async () => {
        try {
            const movies = await fetchMovies();
            if (Array.isArray(movies)) {
                setMovies(movies);
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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setMovieToEdit(null);
    };

    const handleEdit = (movie) => {
        setMovieToEdit(movie);
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h2>Movies</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowModal}>Create Movie</button>
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
                        <tr key={movie.id}>
                            <td>{movie.title}</td>
                            <td>{movie.genre}</td>
                            <td>{movie.duration_minutes}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(movie)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(movie.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <MovieModal
                show={showModal}
                handleClose={handleCloseModal}
                refreshMovies={loadMovies}
                movieToEdit={movieToEdit}
            />
        </div>
    );
}

export default MovieList;