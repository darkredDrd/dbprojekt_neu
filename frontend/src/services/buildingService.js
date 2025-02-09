const API_URL = 'http://localhost:8080/api/buildings';

export async function fetchBuildings() {
    const response = await fetch(API_URL);
    return response.json();
}

export async function fetchBuildingById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
}

export async function createBuilding(building) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actor),
    });
    return response.json();
}

export async function updateBuilding(id, actor) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(building),
    });
    return response.json();
}

export async function deleteBuilding(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}