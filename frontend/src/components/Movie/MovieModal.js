import React from 'react';
import { createMovie, updateMovie } from '../../services/movieService';
import MovieForm from './MovieForm';

function MovieModal({ show, handleClose, refreshMovies, movieToEdit }) {
    const handleSubmit = async (movie) => {
        try {
            if (movieToEdit) {
                await updateMovie(movieToEdit.id, movie);
            } else {
                await createMovie(movie);
            }
            refreshMovies();
            handleClose();
        } catch (error) {
            console.error('Failed to create/update movie:', error);
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
                        <h5 className="modal-title">{movieToEdit ? 'Update Movie' : 'Add Movie'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <MovieForm movieToEdit={movieToEdit} handleSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieModal;