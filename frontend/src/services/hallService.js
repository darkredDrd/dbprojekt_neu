const API_URL = 'http://localhost:8080/api/halls';
const BUILDINGS_API_URL = 'http://localhost:8080/api/buildings';

export async function fetchHalls() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch halls');
    }
    return response.json();
}

export async function fetchHallById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch hall');
    }
    return response.json();
}

export async function createHall(hall) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hall),
    });
    if (!response.ok) {
        throw new Error('Failed to create hall');
    }
    return response.json();
}

export async function updateHall(id, hall) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hall),
    });
    if (!response.ok) {
        throw new Error('Failed to update hall');
    }
    return response.json();
}

export async function deleteHall(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete hall');
    }
    return response.json();
}

export async function fetchBuildings() {
    const response = await fetch(BUILDINGS_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch buildings');
    }
    return response.json();
}