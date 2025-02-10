const API_URL = 'http://localhost:8080/api/actors';

export async function fetchActors() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch actors');
    }
    return response.json();
}

export async function fetchActorById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
}

export async function createActor(actor) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actor),
    });
    return response.json();
}

export async function updateActor(id, actor) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actor),
    });
    return response.json();
}

export async function deleteActor(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}