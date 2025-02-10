import React, { useState, useEffect } from 'react';
import { createRevenue, fetchRevenueById, updateRevenue, fetchRevenues } from '../../services/revenueService';
import { fetchScreenings } from '../../services/screeningService';
import { fetchMovies } from '../../services/movieService';
import { fetchHalls } from '../../services/hallService';

function RevenueModal({ show, handleClose, revenueId, refreshRevenues }) {
    const [screeningId, setScreeningId] = useState('');
    const [totalRevenue, setTotalRevenue] = useState('');
    const [screenings, setScreenings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [existingRevenues, setExistingRevenues] = useState([]);

    useEffect(() => {
        async function loadScreenings() {
            const screenings = await fetchScreenings();
            setScreenings(screenings);
        }

        async function loadMovies() {
            const movies = await fetchMovies();
            setMovies(movies);
        }

        async function loadHalls() {
            const halls = await fetchHalls();
            setHalls(halls);
        }

        async function loadRevenues() {
            const revenues = await fetchRevenues();
            setExistingRevenues(revenues);
        }

        if (show) {
            loadScreenings();
            loadMovies();
            loadHalls();
            loadRevenues();
        }

        if (revenueId) {
            const loadRevenue = async () => {
                const revenue = await fetchRevenueById(revenueId);
                setScreeningId(revenue.screening_id);
                setTotalRevenue(revenue.total_revenue);
            };
            loadRevenue();
        } else {
            setScreeningId('');
            setTotalRevenue('');
        }
    }, [show, revenueId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const revenue = { screening_id: screeningId, total_revenue: totalRevenue };

        // Check if a revenue already exists for the selected screening
        const existingRevenue = existingRevenues.find(r => r.screening_id === screeningId);
        if (existingRevenue && !revenueId) {
            alert('A revenue entry already exists for the selected screening.');
            return;
        }

        if (revenueId) {
            await updateRevenue(revenueId, revenue);
        } else {
            await createRevenue(revenue);
        }
        refreshRevenues();
        handleClose();
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

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{revenueId ? 'Edit Revenue' : 'Create Revenue'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Screening</label>
                                <select
                                    className="form-control"
                                    value={screeningId}
                                    onChange={(e) => setScreeningId(parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Select a screening</option>
                                    {screenings.map(screening => (
                                        <option key={screening.id} value={screening.id}>
                                            {`Movie: ${getMovieName(screening.movie_id)}, Hall: ${getHallName(screening.hall_id)}, Date: ${formatDateTime(screening.date_time)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Total Revenue</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={totalRevenue}
                                    onChange={(e) => setTotalRevenue(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">{revenueId ? 'Update' : 'Create'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueModal;