import React, { useEffect, useState } from 'react';
import { fetchScreenings, deleteScreening, fetchMovies, fetchHalls } from '../../services/screeningService';
import ScreeningModal from './ScreeningModal';
import { format } from 'date-fns';

function ScreeningList() {
    const [screenings, setScreenings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [halls, setHalls] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [screeningToEdit, setScreeningToEdit] = useState(null);

    const loadScreenings = async () => {
        try {
            const screenings = await fetchScreenings();
            const movies = await fetchMovies();
            const halls = await fetchHalls();
            if (Array.isArray(screenings) && Array.isArray(movies) && Array.isArray(halls)) {
                setScreenings(screenings);
                setMovies(movies);
                setHalls(halls);
            } else {
                console.error('Fetched data is not an array:', screenings, movies, halls);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        loadScreenings();
    }, []);

    const handleDelete = async (id) => {
        await deleteScreening(id);
        loadScreenings();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setScreeningToEdit(null);
    };

    const handleEdit = (screening) => {
        setScreeningToEdit(screening);
        setShowModal(true);
    };

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

    return (
        <div className="container mt-5">
            <h2>Screenings</h2>
            <button className="btn btn-primary mb-3" onClick={handleShowModal}>Create Screening</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Hall</th>
                        <th>Date Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {screenings.map(screening => (
                        <tr key={screening.id}>
                            <td>{getMovieTitle(screening.movie_id)}</td>
                            <td>{getHallName(screening.hall_id)}</td>
                            <td>{formatDateTime(screening.date_time)}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(screening)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(screening.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ScreeningModal
                show={showModal}
                handleClose={handleCloseModal}
                refreshScreenings={loadScreenings}
                screeningToEdit={screeningToEdit}
            />
        </div>
    );
}

export default ScreeningList;