import React, { useEffect, useState } from 'react';
import { fetchRevenues, deleteRevenue } from '../../services/revenueService';
import { fetchScreenings } from '../../services/screeningService';
import { fetchMovies } from '../../services/movieService';
import { fetchHalls } from '../../services/hallService';
import RevenueModal from './RevenueModal';

function RevenueList() {
    const [revenues, setRevenues] = useState([]);
    const [screenings, setScreenings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [revenueToEdit, setRevenueToEdit] = useState(null);

    const loadRevenues = async () => {
        try {
            const revenues = await fetchRevenues();
            setRevenues(revenues);
        } catch (error) {
            console.error('Failed to fetch revenues:', error);
        }
    };

    const loadScreenings = async () => {
        try {
            const screenings = await fetchScreenings();
            setScreenings(screenings);
        } catch (error) {
            console.error('Failed to fetch screenings:', error);
        }
    };

    const loadMovies = async () => {
        try {
            const movies = await fetchMovies();
            setMovies(movies);
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        }
    };

    const loadHalls = async () => {
        try {
            const halls = await fetchHalls();
            setHalls(halls);
        } catch (error) {
            console.error('Failed to fetch halls:', error);
        }
    };

    useEffect(() => {
        loadRevenues();
        loadScreenings();
        loadMovies();
        loadHalls();
    }, []);

    const handleDelete = async (id) => {
        await deleteRevenue(id);
        loadRevenues();
    };

    const handleShowRevenueModal = (revenueId = null) => {
        setRevenueToEdit(revenueId);
        setShowRevenueModal(true);
    };

    const handleCloseRevenueModal = () => {
        setShowRevenueModal(false);
        setRevenueToEdit(null);
    };

    const getMovieName = (movieId) => {
        const movie = movies.find(m => m.id === movieId);
        return movie ? movie.title : 'Loading...';
    };

    const getHallName = (hallId) => {
        const hall = halls.find(h => h.id === hallId);
        return hall ? hall.name : 'Loading...';
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    const getScreeningDetails = (screeningId) => {
        const screening = screenings.find(s => s.id === screeningId);
        return screening ? `Movie: ${getMovieName(screening.movie_id)}, Hall: ${getHallName(screening.hall_id)}, Date: ${formatDateTime(screening.date_time)}` : 'Loading...';
    };

    return (
        <div className="container mt-5">
            <h2>Revenues</h2>
            <button className="btn btn-primary mb-3" onClick={() => handleShowRevenueModal()}>Create Revenue</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Screening</th>
                        <th>Total Revenue</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {revenues.map(revenue => (
                        <tr key={revenue.id}>
                            <td>{revenue.id}</td>
                            <td>{getScreeningDetails(revenue.screening_id)}</td>
                            <td>{revenue.total_revenue}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleShowRevenueModal(revenue.id)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(revenue.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <RevenueModal
                show={showRevenueModal}
                handleClose={handleCloseRevenueModal}
                revenueId={revenueToEdit}
                refreshRevenues={loadRevenues}
            />
        </div>
    );
}

export default RevenueList;