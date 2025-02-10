import React from 'react';
import { createHall, updateHall } from '../../services/hallService';
import HallForm from './HallForm';

function HallModal({ show, handleClose, refreshHalls, hallToEdit, buildings }) {
    const handleSubmit = async (hall) => {
        try {
            if (hallToEdit) {
                await updateHall(hallToEdit.id, hall);
            } else {
                await createHall(hall);
            }
            refreshHalls();
            handleClose();
        } catch (error) {
            console.error('Failed to create/update hall:', error);
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
                        <h5 className="modal-title">{hallToEdit ? 'Update Hall' : 'Add Hall'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <HallForm hallToEdit={hallToEdit} handleSubmit={handleSubmit} buildings={buildings} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HallModal;