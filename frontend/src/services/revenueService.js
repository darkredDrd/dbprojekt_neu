const API_URL = 'http://localhost:8080/api/revenues';

export async function fetchRevenues() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch revenues');
    }
    return response.json();
}

export async function fetchRevenueById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch revenue');
    }
    return response.json();
}

export async function createRevenue(revenue) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(revenue),
    });
    if (!response.ok) {
        throw new Error('Failed to create revenue');
    }
    return response.json();
}

export async function updateRevenue(id, revenue) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(revenue),
    });
    if (!response.ok) {
        throw new Error('Failed to update revenue');
    }
    return response.json();
}

export async function deleteRevenue(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete revenue');
    }
    return response.json();
}