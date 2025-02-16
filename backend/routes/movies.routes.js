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

import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} from '../core/movies.js';

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
    fastify.get("/movies", { schema: getMoviesOptions }, async (request, reply) => {
        const movies = await getMovies(fastify);
        reply.code(200).send(movies);
    });

    fastify.get("/movies/:id", { schema: getMovieOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const movie = await getMovieById(fastify, id);
        if (!movie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(movie);
        }
    });

    fastify.post("/movies", { schema: createMovieOptions }, async (request, reply) => {
        const newMovie = request.body;
        const insertedMovie = await createMovie(fastify, newMovie);
        reply.code(201).send(insertedMovie);
    });

    fastify.put("/movies/:id", { schema: updateMovieOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const updatedMovie = await updateMovie(fastify, id, request.body);
        if (!updatedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(updatedMovie);
        }
    });

    fastify.delete("/movies/:id", { schema: deleteMovieOptions }, async (request, reply) => {
        const id = parseInt(request.params.id, 10);
        const deletedMovie = await deleteMovie(fastify, id);
        if (!deletedMovie) {
            reply.code(400).send({ error: `Movie with ID ${id} not found` });
        } else {
            reply.code(200).send(deletedMovie);
        }
    });
}

export { movieRoutes };