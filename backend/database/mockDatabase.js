// backend/database/mockDatabase.js
let mockData = {
    buildings: [],
    actors: [],
    halls: [],
    movies: [],
    screenings: [],
    revenues: []
};

export function getCollection(collectionName) {
    return mockData[collectionName];
}

export function insertDocument(collectionName, document) {
    mockData[collectionName].push(document);
    return document;
}

export function updateDocument(collectionName, id, updatedDocument) {
    const collection = mockData[collectionName];
    const index = collection.findIndex(doc => doc.id === id);
    if (index !== -1) {
        collection[index] = { ...collection[index], ...updatedDocument };
        return collection[index];
    }
    return null;
}

export function deleteDocument(collectionName, id) {
    const collection = mockData[collectionName];
    const index = collection.findIndex(doc => doc.id === id);
    if (index !== -1) {
        return collection.splice(index, 1)[0];
    }
    return null;
}