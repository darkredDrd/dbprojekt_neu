import React, { useState, useEffect } from 'react';
import { fetchMovies, fetchHalls } from '../../services/screeningService';

function ScreeningForm({ screeningToEdit, handleSubmit }) {
    const [movieId, setMovieId] = useState('');
    const [hallId, setHallId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);

    useEffect(() => {
        async function loadMoviesAndHalls() {
            try {
                const movies = await fetchMovies();
                const halls = await fetchHalls();
                setMovies(movies);
                setHalls(halls);
            } catch (error) {
                console.error('Failed to fetch movies or halls:', error);
            }
        }
        loadMoviesAndHalls();
    }, []);

    useEffect(() => {
        if (screeningToEdit) {
            setMovieId(screeningToEdit.movie_id);
            setHallId(screeningToEdit.hall_id);
            setDateTime(screeningToEdit.date_time);
        } else {
            setMovieId('');
            setHallId('');
            setDateTime('');
        }
    }, [screeningToEdit]);

    const onSubmit = (e) => {
        e.preventDefault();
        const screening = {
            movie_id: parseInt(movieId, 10),
            hall_id: parseInt(hallId, 10),
            date_time: new Date(dateTime).toISOString(), // Convert to ISO 8601 format
        };
        handleSubmit(screening);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Movie</label>
                <select
                    className="form-control"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    required
                >
                    <option value="">Select a movie</option>
                    {movies.map(movie => (
                        <option key={movie.id} value={movie.id}>
                            {movie.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Hall</label>
                <select
                    className="form-control"
                    value={hallId}
                    onChange={(e) => setHallId(e.target.value)}
                    required
                >
                    <option value="">Select a hall</option>
                    {halls.map(hall => (
                        <option key={hall.id} value={hall.id}>
                            {hall.building_name} - {hall.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Date Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">{screeningToEdit ? 'Update Screening' : 'Add Screening'}</button>
        </form>
    );
}

export default ScreeningForm;