import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/mockDatabase.js';

/**
 * Includes the routes for the '/movies' API endpoint.
 * 
 * With this route the user can:
 * - GET all movies
 * - GET a single movie by ID
 * - POST a new movie
 * - PUT (update) a movie by ID
 * - DELETE a movie by ID
 */
async function movieRoutes(fastify, options) {
    fastify.get("/movies", async (request, reply) => {
        const movies = getCollection('movies');
        reply.code(200).send(movies);
    });

    fastify.get("/movies/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const movie = getCollection('movies').find(m => m.id === id);
        if (!movie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(movie);
        }
    });

    fastify.post("/movies", async (request, reply) => {
        const newMovie = request.body;
        const insertedMovie = insertDocument('movies', newMovie);
        reply.code(201).send(insertedMovie);
    });

    fastify.put("/movies/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedMovie = updateDocument('movies', id, request.body);
        if (!updatedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedMovie);
        }
    });

    fastify.delete("/movies/:id", async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedMovie = deleteDocument('movies', id);
        if (!deletedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedMovie);
        }
    });
}

export { movieRoutes };