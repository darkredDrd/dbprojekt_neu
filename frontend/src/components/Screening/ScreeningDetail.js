import React, { useEffect, useState } from 'react';
import { fetchScreeningById, fetchMovies, fetchHalls } from '../../services/screeningService';
import { format } from 'date-fns';

function ScreeningDetail({ match }) {
    const [screening, setScreening] = useState(null);
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const { id } = match.params;

    useEffect(() => {
        async function loadScreening() {
            const screening = await fetchScreeningById(id);
            const movies = await fetchMovies();
            const halls = await fetchHalls();
            setScreening(screening);
            setMovies(movies);
            setHalls(halls);
        }
        loadScreening();
    }, [id]);

    const getMovieTitle = (id) => {
        const movie = movies.find(movie => movie.id === id);
        return movie ? movie.title : 'Unknown';
    };

    const getHallName = (id) => {
        const hall = halls.find(hall => hall.id === id);
        return hall ? hall.name : 'Unknown';
    };

    const formatDateTime = (dateTime) => {
        return format(new Date(dateTime), 'PPpp');
    };

    if (!screening) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Screening Detail</h2>
            <p>Movie: {getMovieTitle(screening.movie_id)}</p>
            <p>Hall: {getHallName(screening.hall_id)}</p>
            <p>Date Time: {formatDateTime(screening.date_time)}</p>
        </div>
    );
}

export default ScreeningDetail;