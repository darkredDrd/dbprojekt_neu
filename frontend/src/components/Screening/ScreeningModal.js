import React from 'react';
import { createScreening, updateScreening } from '../../services/screeningService';
import ScreeningForm from './ScreeningForm';

function ScreeningModal({ show, handleClose, refreshScreenings, screeningToEdit }) {
    const handleSubmit = async (screening) => {
        try {
            if (screeningToEdit) {
                await updateScreening(screeningToEdit.id, screening);
            } else {
                await createScreening(screening);
            }
            refreshScreenings();
            handleClose();
        } catch (error) {
            console.error('Failed to create/update screening:', error);
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
                        <h5 className="modal-title">{screeningToEdit ? 'Update Screening' : 'Add Screening'}</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ScreeningForm screeningToEdit={screeningToEdit} handleSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScreeningModal;