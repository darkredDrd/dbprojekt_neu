import React, { useEffect, useState } from 'react';
import { fetchMovieById } from '../../services/movieService';

function MovieDetail({ match }) {
    const [movie, setMovie] = useState(null);
    const { id } = match.params;

    useEffect(() => {
        async function loadMovie() {
            const movie = await fetchMovieById(id);
            setMovie(movie);
        }
        loadMovie();
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Movie Detail</h2>
            <p>Title: {movie.title}</p>
            <p>Genre: {movie.genre}</p>
            <p>Duration: {movie.duration_minutes} minutes</p>
        </div>
    );
}

export default MovieDetail;