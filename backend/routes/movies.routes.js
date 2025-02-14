import {
    getCollection,
    insertDocument,
    updateDocument,
    deleteDocument
} from '../database/database.js';
import {
    getMoviesOptions,
    getMovieOptions,
    createMovieOptions,
    updateMovieOptions,
    deleteMovieOptions
} from '../schemas/movies.schemas.js';

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
    fastify.get("/movies", { schema: getMoviesOptions.schema }, async (request, reply) => {
        const movies = await getCollection('movies');
        reply.code(200).send(movies);
    });

    fastify.get("/movies/:id", { schema: getMovieOptions.schema }, async (request, reply) => {
        const id = request.params.id;
        const movies = await getCollection('movies');
        const movie = movies.find(m => m._id.toString() === id);
        if (!movie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(movie);
        }
    });

    fastify.post("/movies", { schema: createMovieOptions.schema }, async (request, reply) => {
        const newMovie = request.body;
        const insertedMovie = await insertDocument('movies', newMovie);
        reply.code(201).send(insertedMovie);
    });

    fastify.put("/movies/:id", { schema: updateMovieOptions.schema }, async (request, reply) => {
        const id = request.params.id;
        const updatedMovie = await updateDocument('movies', id, request.body);
        if (!updatedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedMovie);
        }
    });

    fastify.delete("/movies/:id", { schema: deleteMovieOptions.schema }, async (request, reply) => {
        const id = request.params.id;
        const deletedMovie = await deleteDocument('movies', id);
        if (!deletedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedMovie);
        }
    });
}

export { movieRoutes };