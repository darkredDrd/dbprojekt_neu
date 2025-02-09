const API_URL = 'http://localhost:8080/api/screenings';
const MOVIES_API_URL = 'http://localhost:8080/api/movies';
const HALLS_API_URL = 'http://localhost:8080/api/halls';

export async function fetchScreenings() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch screenings');
    }
    return response.json();
}

export async function fetchScreeningById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch screening');
    }
    return response.json();
}

export async function createScreening(screening) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(screening),
    });
    if (!response.ok) {
        throw new Error('Failed to create screening');
    }
    return response.json();
}

export async function updateScreening(id, screening) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(screening),
    });
    if (!response.ok) {
        throw new Error('Failed to update screening');
    }
    return response.json();
}

export async function deleteScreening(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete screening');
    }
    return response.json();
}

export async function fetchMovies() {
    const response = await fetch(MOVIES_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    return response.json();
}

export async function fetchHalls() {
    const response = await fetch(HALLS_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch halls');
    }
    return response.json();
}