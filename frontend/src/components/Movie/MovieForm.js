import React, { useState, useEffect } from 'react';

function MovieForm({ movieToEdit, handleSubmit }) {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');

    useEffect(() => {
        if (movieToEdit) {
            setTitle(movieToEdit.title);
            setGenre(movieToEdit.genre);
            setDurationMinutes(movieToEdit.duration_minutes);
        } else {
            setTitle('');
            setGenre('');
            setDurationMinutes('');
        }
    }, [movieToEdit]);

    const onSubmit = (e) => {
        e.preventDefault();
        const movie = {
            title,
            genre,
            duration_minutes: parseInt(durationMinutes, 10),
        };
        handleSubmit(movie);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Genre</label>
                <input
                    type="text"
                    className="form-control"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                    type="number"
                    className="form-control"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">{movieToEdit ? 'Update Movie' : 'Add Movie'}</button>
        </form>
    );
}

export default MovieForm;