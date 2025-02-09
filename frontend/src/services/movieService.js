const API_URL = 'http://localhost:8080/api/movies';

export async function fetchMovies() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    return response.json();
}

export async function fetchMovieById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }
    return response.json();
}

export async function createMovie(movie) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    });
    if (!response.ok) {
        throw new Error('Failed to create movie');
    }
    return response.json();
}

export async function updateMovie(id, movie) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    });
    if (!response.ok) {
        throw new Error('Failed to update movie');
    }
    return response.json();
}

export async function deleteMovie(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete movie');
    }
    return response.json();
}