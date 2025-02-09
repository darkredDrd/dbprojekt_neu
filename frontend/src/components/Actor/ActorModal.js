import React, { useState, useEffect } from 'react';
import { createActor, updateActor } from '../../services/actorService';

function ActorModal({ show, handleClose, refreshActors, actorToEdit }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    useEffect(() => {
        if (actorToEdit) {
            setName(actorToEdit.name);
            setBirthDate(actorToEdit.birth_date);
        } else {
            setName('');
            setBirthDate('');
        }
    }, [actorToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const actor = { name, birth_date: birthDate };
        if (actorToEdit) {
            await updateActor(actorToEdit.id, actor);
        } else {
            await createActor(actor);
        }
        refreshActors();
        handleClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{actorToEdit ? 'Update Actor' : 'Add Actor'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
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
                            <button type="submit" className="btn btn-primary">{actorToEdit ? 'Update Actor' : 'Add Actor'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActorModal;