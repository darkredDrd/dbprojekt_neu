import React, { useState } from 'react';
import { createActor } from '../../services/actorService';

function ActorForm() {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const actor = { name, birth_date: birthDate };
        await createActor(actor);
        setName('');
        setBirthDate('');
    };

    return (
        <div className="container mt-5">
            <h2>Add Actor</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Birth Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Actor</button>
            </form>
        </div>
    );
}

export default ActorForm;