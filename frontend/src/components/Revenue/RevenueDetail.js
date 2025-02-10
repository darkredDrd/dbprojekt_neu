import React, { useEffect, useState } from 'react';
import { fetchRevenueById } from '../../services/revenueService';
import { useParams } from 'react-router-dom';

function RevenueDetail() {
    const [revenue, setRevenue] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const loadRevenue = async () => {
            const revenue = await fetchRevenueById(id);
            setRevenue(revenue);
        };
        loadRevenue();
    }, [id]);

    if (!revenue) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Revenue Detail</h2>
            <p><strong>ID:</strong> {revenue.id}</p>
            <p><strong>Screening ID:</strong> {revenue.screening_id}</p>
            <p><strong>Total Revenue:</strong> {revenue.total_revenue}</p>
        </div>
    );
}

export default RevenueDetail;