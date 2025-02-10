const API_URL = 'http://localhost:8080/api/movies';

export async function fetchMovieActors(movieId) {
    const response = await fetch(`${API_URL}/${movieId}/actors`);
    if (!response.ok) {
        throw new Error('Failed to fetch movie actors');
    }
    return response.json();
}

export async function addActorToMovie(movieId, actorId) {
    const response = await fetch(`${API_URL}/${movieId}/actors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actorId }),
    });
    if (!response.ok) {
        throw new Error('Failed to add actor to movie');
    }
    return response.json();
}

export async function deleteActorFromMovie(movieId, actorId) {
    const response = await fetch(`${API_URL}/${movieId}/actors/${actorId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete actor from movie');
    }
    return response.json();
}