import React, { useState, useEffect } from 'react';
import { createRevenue, fetchRevenueById, updateRevenue } from '../../services/revenueService';
import { useHistory, useParams } from 'react-router-dom';

function RevenueForm() {
    const [screeningId, setScreeningId] = useState('');
    const [totalRevenue, setTotalRevenue] = useState('');
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        if (id) {
            const loadRevenue = async () => {
                const revenue = await fetchRevenueById(id);
                setScreeningId(revenue.screening_id);
                setTotalRevenue(revenue.total_revenue);
            };
            loadRevenue();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const revenue = { screening_id: screeningId, total_revenue: totalRevenue };
        if (id) {
            await updateRevenue(id, revenue);
        } else {
            await createRevenue(revenue);
        }
        history.push('/revenues');
    };

    return (
        <div className="container mt-5">
            <h2>{id ? 'Edit Revenue' : 'Create Revenue'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Screening ID</label>
                    <input
                        type="number"
                        className="form-control"
                        value={screeningId}
                        onChange={(e) => setScreeningId(e.target.value)}
                        required
                    />
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
                <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
}

export default RevenueForm;